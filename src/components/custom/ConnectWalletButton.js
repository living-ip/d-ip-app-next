import {Button} from "@/components/ui/button";
import * as React from "react";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";

export default function ConnectWalletButton({}) {
	const {isAuthenticated, setShowAuthFlow} = useDynamicContext()

	if (isAuthenticated) {
		return (
			// TODO return little user profile thing
			<div/>
		)
	}
	return (
		<Button onClick={(e) => {
			e.preventDefault();
			setShowAuthFlow(true)
		}}>Connect Wallet</Button>
	)
}
