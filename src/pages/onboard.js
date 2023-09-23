import {Inter} from 'next/font/google'
import NavBar from "@/components/NavBar";
import {RegisterCard} from "@/components/RegisterCard";
import {authStytchRequest} from "@/lib/stytch";

const inter = Inter({subsets: ['latin']})

export default function Onboard({user}) {
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
        // const userProfile = await getUserProfile(session.user_id)
        // if (userProfile) {
        //     return {
        //         redirect: {
        //             destination: "/matches",
        //             permanent: false,
        //         }
        //     }
        // } return {
        //     props: {}
        // }
        return {
            props: {}
        }
    } catch (e) {
        console.error(e)
        return noAuthResponse;
    }
}