import SignMessageComponent from "@/components/wallet/SignMessage";
import WalletConnectorAndModal from "@/components/wallet/WalletConnectorAndModal";
import { authStytchRequest } from "@/lib/stytch";

export default function WalletPage({userId}) {
    return (
        <WalletConnectorAndModal>
            <SignMessageComponent userId={userId} />
        </WalletConnectorAndModal>
    )
}

export const getServerSideProps = async ({req}) => {
    const session = await authStytchRequest(req)
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    return {
        props: {
            userId: session.user_id
        }
    }
}
