import {useEffect} from "react";
import {useRouter} from "next/router";
import {useStytchUser} from "@stytch/nextjs";
import Profile from "@/components/simple/Profile";
import loadStytch from "@/lib/stytch";

export default function ProfilePage() {
    const {user, isInitialized} = useStytchUser();
    const router = useRouter();

    // If the Stytch SDK no longer has a User then redirect to login; for example after logging out.
    useEffect(() => {
        if (isInitialized && !user) {
            console.log("PROFILE PAGE HAS NO USER REDIRECT")
            router.replace("/login");
        }
    }, [user, isInitialized, router]);

    return <Profile/>;
}

/*
In this example ProfilePage is a protected route, meaning we only allow authenticated users to access this page.

We enforce this server-side by authenticating the Stytch Session which the SDK stores and manages in browser cookies.
If the session authentication fails, for instance if a logged out user attempts to go to localhost:3000/profile directly we redirect to the login page.

In this example, we authenticate the session JWT as it is more performant. Learn more at https://stytch.com/docs/sessions#session-tokens-vs-JWTs
*/
export async function getServerSideProps({req}) {
    const redirectRes = {
        redirect: {
            destination: "/",
            permanent: false,
        },
    };
    const sessionJWT = req.cookies["stytch_session_jwt"];
    const sessionToken = req.cookies["stytch_session"];

    if (!sessionJWT) {
        return redirectRes;
    }

    // loadStytch() is a helper function for initalizing the Stytch Backend SDK. See the function definition for more details.
    const stytchClient = loadStytch();

    try {
        // Authenticate the session JWT. If an error is thrown the session authentication has failed.
        const response = await stytchClient.sessions.authenticateJwt(sessionJWT);

        return {props: {}};
    } catch (e) {
        console.log(e)
        return redirectRes;
    }
}