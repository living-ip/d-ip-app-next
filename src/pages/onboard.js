import {Inter} from 'next/font/google'
import NavBar from "@/components/NavBar";
import {RegisterCard} from "@/components/RegisterCard";
import {authStytchRequest} from "@/lib/stytch";
import { getUserProfile } from '@/lib/user';
import WalletConnectorAndModal from '@/components/wallet/WalletConnectorAndModal';
import SignMessageComponent from '@/components/wallet/SignMessage';

const inter = Inter({subsets: ['latin']})

export default function Onboard({user}) {
    if (user) {
        return (
            <WalletConnectorAndModal>
                <SignMessageComponent userId={user.uid} />
            </WalletConnectorAndModal>
        )
    }
    return (
        <NavBar>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <RegisterCard/>
            </div>
        </NavBar>
    )
}

export const getServerSideProps = async ({req, query}) => {
    const noAuthResponse = {
        redirect: {
            destination: "/login",
            permanent: false,
        },
    };
    try {
        // Authenticate the session JWT. If an error is thrown the session authentication has failed.
        const session = await authStytchRequest(req)
        if (!session) {
            return noAuthResponse
        }
        const { userProfile } = await getUserProfile(session.user_id)
        if (userProfile) {
            if (!userProfile.walletAddress) {
                return {
                    props: {
                        user: userProfile
                    }
                }
            }
            return {
                redirect: {
                    destination: "/discover",
                    permanent: false,
                }
            }
        }
        return {
            props: {}
        }
    } catch (e) {
        console.error(e)
        return noAuthResponse;
    }
}