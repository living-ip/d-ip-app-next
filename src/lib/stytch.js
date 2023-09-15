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

export default loadStytch;