import * as React from "react";

import {ProfileCard} from "@/components/custom/ProfileCard";
import {NewLayout} from "@/components/NewLayout";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile, getUserRoles} from "@/lib/user";
import {getProjects} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";


export default function ProfilePage() {
	const [userProfile] = useStore((state) => [state.userProfile]);

	const contributions = [
		{
			name: "Claynosaurz Vision Statement",
			status: "Approved",
			published_at: "14 April, 2024",
		},
		{
			name: "Claynosaurz Vision Statement",
			status: "Rejected",
			published_at: "14 April, 2024",
		},
		{
			name: "Claynosaurz Vision Statement",
			status: "Approved",
			published_at: "14 April, 2024",
		},
	];


	const votes = [
		{
			status: "Approve",
			name: "Mission & Vision Statement",
			created_at: "14 April, 2024",
		},
		{
			status: "Reject",
			name: "Mission & Vision Statement",
			created_at: "14 April, 2024",
		},
		{
			status: "Approve",
			name: "Mission & Vision Statement",
			created_at: "14 April, 2024",
		},
	];

	return (
		<NewLayout>
			<main
				className="flex justify-center items-center self-center px-16 py-8 mx-16 w-full bg-white rounded-3xl shadow max-md:px-5 max-md:max-w-full">
				<div className="w-full max-w-[1232px] max-md:max-w-full">
					<div className="flex gap-5 max-md:flex-col max-md:gap-0">
						<aside className="flex flex-col w-[32%] max-md:ml-0 max-md:w-full">
							<ProfileCard profile={userProfile}/>
						</aside>
						{/*<div className="flex flex-col ml-5 w-[68%] max-md:ml-0 max-md:w-full">*/}
						{/*  <section className="flex flex-col grow pb-20 max-md:mt-10 max-md:max-w-full">*/}
						{/*    <Contributions contributions={contributions}/>*/}
						{/*    <Votes votes={votes}/>*/}
						{/*  </section>*/}
						{/*</div>*/}
					</div>
				</div>
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
	const {userProfile} = await getUserProfile(session.user_id, sessionJWT);
	if (!userProfile) {
		return {
			redirect: {
				destination: "/onboard",
				permanent: false,
			},
		};
	}

	const projects = await getProjects(sessionJWT);
	console.log("Projects: ", projects);

	const userRoles = await getUserRoles(session.user_id, sessionJWT);
	console.log("User Roles: ", userRoles);

	const zustandServerStore = initializeStore({
		userProfile,
		userRoles,
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
}
