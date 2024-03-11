import * as stytch from "stytch";

let client;

/*
loadStytch initializes the Stytch Backend SDK using your project's id and secret. The Backend SDK can be used
on any code paths that run server side. In a Next.js app that typically means in getServerSideProps and API routes.

In this example, we use the Backend SDK in getServerSideProps for the protected page /profile which can only be viewed if the user has an active Stytch session.
*/
const loadStytch = () => {
    if (!client) {
        client = new stytch.Client({
            project_id: process.env.STYTCH_PROJECT_ID || "project-test-e2aad237-63bb-4d48-86e6-3754cfe0659b",
            secret: process.env.STYTCH_SECRET || "secret-test-iGRYt-CliBn0eP2rd3FlChnh7IfNbk1swPU=",
            env: stytch.envs.test
        });
    }
    return client;
};

export const authStytchRequest = async (req) => {
    const sessionJWT = req.cookies["stytch_session_jwt"];
    // console.log('Got token', sessionJWT)
    if (!sessionJWT) {
        return {};
    }
    // loadStytch() is a helper function for initalizing the Stytch Backend SDK. See the function definition for more details.
    return await authStytchToken(sessionJWT);
}

export const authStytchToken = async (token) => {
    console.log("Validating token")
    const stytchClient = loadStytch();
    try {
        // Authenticate the session JWT. If an error is thrown the session authentication has failed.
        const {session, user} = await stytchClient.sessions.authenticate({session_jwt: token});
        console.log('Got stytch session', session)
        console.log('Got stytch user', user)
        return {session, user}
    } catch (e) {
        return {};
    }
}

export default loadStytch;