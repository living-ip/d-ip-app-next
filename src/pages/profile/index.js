import * as React from "react";
import {ProfileCard} from "@/components/custom/ProfileCard";
import {NewLayout} from "@/components/NewLayout";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/user";
import {getProjects} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";

export default function ProfilePage() {
	const [userProfile] = useStore((state) => [state.userProfile]);
	return (
		<NewLayout>
			<main className="container mx-auto px-4 py-8 max-w-3xl">
				<ProfileCard profile={userProfile}/>
			</main>
		</NewLayout>
	);
}
export const getServerSideProps = async ({req}) => {
	const {session} = await authStytchRequest(req);
	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}
	const sessionJWT = req.cookies["stytch_session_jwt"];
	const {userProfile, roles} = await getUserProfile(session.user_id, sessionJWT);
	if (!userProfile) {
		return {
			redirect: {
				destination: "/onboard",
				permanent: false,
			},
		};
	}
	const projects = await getProjects(sessionJWT);
	const zustandServerStore = initializeStore({
		userProfile,
		userRoles: roles,
		currentProject: undefined,
	});
	return {
		props: {
			projects,
			initialZustandState: JSON.parse(
				JSON.stringify(zustandServerStore.getState())
			),
		},
	};
};