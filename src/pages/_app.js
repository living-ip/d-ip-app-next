import '@/styles/globals.css'
import {createStytchUIClient} from "@stytch/nextjs/ui";
import {StytchProvider} from "@stytch/nextjs";
import Wallet from "@/components/Wallet";

const stytch = createStytchUIClient(
    process.env.STYTCH_PUBLIC_TOKEN || "public-token-test-0d6d430c-8503-41d0-b4bb-97b6a448f6ac"
);

export default function App({ Component, pageProps }) {
  return (<>
            <StytchProvider stytch={stytch}>
                    <Component {...pageProps} />
            </StytchProvider>
        </>
    )
}
