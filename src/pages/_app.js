import '@/styles/globals.css'
import {createStytchUIClient} from '@stytch/nextjs/ui'
import {StytchProvider} from '@stytch/nextjs'
import {DynamicContextProvider, getAuthToken, useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {SolanaWalletConnectors} from "@dynamic-labs/solana";
import Head from "next/head";
import StoreProvider from "@/lib/storeProvider";
import {Toaster} from "@/components/ui/toaster";
import {deleteCookie, setCookie} from "cookies-next";
import {useEffect, useState, useCallback} from "react";
import { Analytics } from "@vercel/analytics/react"

const stytch = createStytchUIClient(
	process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN ||
	'public-token-test-0d6d430c-8503-41d0-b4bb-97b6a448f6ac'
)

export default function App({Component, pageProps}) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const setAuthCookie = useCallback(() => {
		console.log('setAuthCookie called');
		const authToken = getAuthToken();
		console.log('authToken:', authToken);
		if (authToken) {
			try {
				const expirationDate = new Date();
				expirationDate.setDate(expirationDate.getDate() + 14); // 14 days from now
				document.cookie = `x_d_jwt=${authToken}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict; Secure`;
				console.log('Cookie set attempt completed');
				console.log('Current cookies:', document.cookie);
			} catch (error) {
				console.error('Error setting cookie:', error);
			}
		} else {
			console.error('Auth token is undefined');
		}
	}, []);

	const handleAuthSuccess = useCallback(() => {
		console.log('handleAuthSuccess called');
		setIsAuthenticated(true);
		setAuthCookie();
	}, [setAuthCookie]);

	const handleLogout = useCallback(() => {
		console.log('handleLogout called');
		deleteCookie('x_d_jwt', {path: '/'});
		setIsAuthenticated(false);
	}, []);

	useEffect(() => {
		console.log('useEffect running, isAuthenticated:', isAuthenticated);
		if (isAuthenticated) {
			setAuthCookie();
		}
	}, [isAuthenticated, setAuthCookie]);

	useEffect(() => {
		const checkInitialAuth = () => {
			const token = getAuthToken();
			if (token) {
				console.log('Initial auth token found');
				setIsAuthenticated(true);
				setAuthCookie();
			}
		};
		checkInitialAuth();
	}, [setAuthCookie]);

	return (
		<>
			<Head>
				<title>Living IP</title>
				<link rel="icon" href="https://storage.googleapis.com/syb_us_cdn/sibylline_favicon.png"/>
			</Head>
			<DynamicContextProvider
				theme="auto"
				settings={{
					environmentId: "17eae500-ba75-4c6c-a7ae-fbc3049c5178",
					walletConnectors: [SolanaWalletConnectors],
					eventsCallbacks: {
						onAuthSuccess: handleAuthSuccess,
						onLogout: handleLogout,
					}
				}}
			>
				<StytchProvider stytch={stytch}>
					<StoreProvider {...pageProps.initialZustandState}>
						<Component {...pageProps} />
						<Analytics/>
					</StoreProvider>
				</StytchProvider>
			</DynamicContextProvider>
			<Toaster/>
		</>
	)
}
