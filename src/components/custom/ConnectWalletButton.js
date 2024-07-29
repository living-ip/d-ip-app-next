import {Button} from "@/components/ui/button";
import * as React from "react";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";

export default function ConnectWalletButton({}) {
	const {isAuthenticated, setShowAuthFlow, setShowDynamicUserProfile} = useDynamicContext()

	if (isAuthenticated) {
		return (
			<div
			        onClick={(e) => {
				        e.preventDefault();
				        setShowDynamicUserProfile(true)
			        }}>
				Open Wallet
			</div>
		)
	}
	return (
		<div
		        onClick={(e) => {
			        e.preventDefault();
			        setShowAuthFlow(true)
		        }}>
			Connect Wallet
		</div>
	)
}
