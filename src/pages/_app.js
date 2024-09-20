import '@/styles/globals.css'
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { createStytchUIClient } from '@stytch/nextjs/ui'
import { StytchProvider } from '@stytch/nextjs'
import { DynamicContextProvider, getAuthToken } from "@dynamic-labs/sdk-react-core";
import {IsBrowser} from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import Head from "next/head";
import StoreProvider from "@/lib/storeProvider";
import { Toaster } from "@/components/ui/toaster";
import { deleteCookie } from "cookies-next";
import { useEffect, useState, useCallback } from "react";
import { Analytics } from "@vercel/analytics/react"
import {useRouter} from "next/router";
import { createUserProfile } from '@/lib/user';

const stytch = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN ||
  'public-token-test-0d6d430c-8503-41d0-b4bb-97b6a448f6ac'
)

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleAuthSuccess = useCallback(() => {
    console.log('handleAuthSuccess called');
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    console.log('handleLogout called');
    deleteCookie('x_d_jwt', { path: '/' });
    setIsAuthenticated(false);
  }, []);

  const setAuthCookie = useCallback(async (token) => {
    try {
      const response = await fetch('/api/set-auth-cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if (response.ok) {
        console.log('Cookie set successfully');
        const responseData = await response.json();
        console.log('Server response:', responseData);
      } else {
        console.error('Failed to set cookie. Status:', response.status);
        const errorData = await response.text();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const authToken = getAuthToken();
      if (authToken) {
        setAuthCookie(authToken);
      } else {
        console.error('Auth token is undefined');
      }
    }
  }, [isAuthenticated, setAuthCookie]);

  useEffect(() => {
    const checkCookie = () => {
      const cookies = document.cookie.split(';');
      const hasAuthCookie = cookies.some(cookie => cookie.trim().startsWith('x_d_jwt='));
      console.log('Auth cookie present:', hasAuthCookie);
    };

    checkCookie();
  }, [isAuthenticated]);

  useEffect(() => {
    const checkInitialAuth = () => {
      const token = getAuthToken();
      if (token) {
        console.log('Initial auth token found');
        setIsAuthenticated(true);
      }
    };
    checkInitialAuth();
  }, []);

  return (
    <>
      <Head>
        <title>Living IP</title>
        <link rel="icon" href="https://storage.googleapis.com/syb_us_cdn/sibylline_favicon.png" />
      </Head>
      <IsBrowser>
      <DynamicContextProvider
        theme="auto"
        settings={{
          environmentId: process.env.DYNAMIC_ENV || "17eae500-ba75-4c6c-a7ae-fbc3049c5178",
          walletConnectors: [SolanaWalletConnectors],
          handlers: {
						handleVerifiedUser: async (args) => {
							console.log("Handling verified user", args);
							const userData = {
								name: args.user.username,
							};
							await createUserProfile(userData, getAuthToken());
						},
					},
          eventsCallbacks: {
            onAuthSuccess: handleAuthSuccess,
            onLogout: handleLogout,
          }
        }}
      >
        <StytchProvider stytch={stytch}>
          <StoreProvider {...pageProps.initialZustandState}>
            <Component {...pageProps} />
            <Analytics />
          </StoreProvider>
        </StytchProvider>
      </DynamicContextProvider>
      <Toaster />
      </IsBrowser>
    </>
  )
}
