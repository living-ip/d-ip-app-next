import SignMessageComponent from "@/components/wallet/SignMessage";
import WalletConnectorAndModal from "@/components/wallet/WalletConnectorAndModal";

export default function WalletPage() {
    return (
        <WalletConnectorAndModal>
            <SignMessageComponent/>
        </WalletConnectorAndModal>
    )
}