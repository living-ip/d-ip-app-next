import '@/styles/globals.css'
import {createStytchUIClient} from '@stytch/nextjs/ui'
import {StytchProvider} from '@stytch/nextjs'
import {DynamicContextProvider, getAuthToken} from "@dynamic-labs/sdk-react-core";
import {SolanaWalletConnectors} from "@dynamic-labs/solana";
import Head from "next/head";
import StoreProvider from "@/lib/storeProvider";
import {Toaster} from "@/components/ui/toaster";
import {setCookie} from "cookies-next";

const stytch = createStytchUIClient(
	process.env.STYTCH_PUBLIC_TOKEN ||
	'public-token-test-0d6d430c-8503-41d0-b4bb-97b6a448f6ac'
)

export default function App({Component, pageProps}) {
	return (
		<>
			<Head>
				<title>Living IP</title>
				<link rel="icon" href="https://storage.googleapis.com/syb_us_cdn/sibylline_favicon.png"/>
			</Head>
			<DynamicContextProvider
				theme={"light"}
				settings={{
					environmentId: "17eae500-ba75-4c6c-a7ae-fbc3049c5178",
					walletConnectors: [SolanaWalletConnectors],
					eventsCallbacks: {
						onAuthSuccess: () => {
							const authToken = getAuthToken();
							console.log('authToken', authToken);
							setCookie( 'x_d_jwt', authToken, {
								maxAge: 60 * 60 * 24 * 7,
							});
						},
					}
				}}>
				<StytchProvider stytch={stytch}>
					<StoreProvider {...pageProps.initialZustandState}>
						<Component {...pageProps} />
					</StoreProvider>
				</StytchProvider>
			</DynamicContextProvider>
			<Toaster/>
		</>
	)
}
