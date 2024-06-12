import {RegisterCard} from "@/components/RegisterCard";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/user";
import {NewLayout} from "@/components/NewLayout";

export default function Onboard() {
	return (
		<NewLayout>
			<div className="flex items-center justify-center">
				<RegisterCard/>
			</div>
		</NewLayout>
	);
}

export const getServerSideProps = async ({req, query}) => {
	const noAuthResponse = {
		redirect: {
			destination: "/login",
			permanent: false,
		},
	};
	try {
		// Authenticate the session JWT. If an error is thrown the session authentication has failed.
		const {session} = await authStytchRequest(req);
		if (!session) {
			return noAuthResponse;
		}
		const sessionJWT = req.cookies["stytch_session_jwt"];
		const {userProfile} = await getUserProfile(session.user_id, sessionJWT);
		if (userProfile) {
			return {
				redirect: {
					destination: "/projects",
					permanent: false,
				},
			};
		}
		return {
			props: {},
		};
	} catch (e) {
		console.error(e);
		return noAuthResponse;
	}
};
