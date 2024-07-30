import '@/styles/globals.css'
import { createStytchUIClient } from '@stytch/nextjs/ui'
import { StytchProvider } from '@stytch/nextjs'
import { DynamicContextProvider, getAuthToken } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import Head from "next/head";
import StoreProvider from "@/lib/storeProvider";
import { Toaster } from "@/components/ui/toaster";
import { deleteCookie, setCookie } from "cookies-next";

const stytch = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN ||
  'public-token-test-0d6d430c-8503-41d0-b4bb-97b6a448f6ac'
)

export default function App({ Component, pageProps }) {
  const handleAuthSuccess = () => {
    const authToken = getAuthToken();
    console.log('authToken', authToken);
    setCookie('x_d_jwt', authToken, {
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  };

  const handleLogout = () => {
    deleteCookie('x_d_jwt', { path: '/' });
  };

  return (
    <>
      <Head>
        <title>Living IP</title>
        <link rel="icon" href="https://storage.googleapis.com/syb_us_cdn/sibylline_favicon.png" />
      </Head>
      <DynamicContextProvider
        theme="light"
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
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
          </StoreProvider>
        </StytchProvider>
      </DynamicContextProvider>
      <Toaster />
    </>
  )
}