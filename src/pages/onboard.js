import {RegisterCard} from "@/components/cards/RegisterCard";
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
		const sessionJWT = req.cookies["x_d_jwt"];
		const {userProfile} = await getUserProfile("TODO", sessionJWT);
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
