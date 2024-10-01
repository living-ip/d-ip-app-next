import * as React from "react";
import {useState, useEffect} from "react";
import {ProfileCard} from "@/components/cards/ProfileCard";
import {MainLayout} from "@/components/layouts/MainLayout";
import {getOwnUserProfile, getUserChanges, getUserVotes} from "@/lib/user";
import {getProjects} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";

export default function ProfilePage() {
	const [userProfile] = useStore((state) => [state.userProfile]);
	const [votes, setVotes] = useState([]);
	const [changes, setChanges] = useState([]);

	useEffect(() => {
		console.log(userProfile);
		async function fetchVotes() {
			const { votes } = await getUserVotes(userProfile.uid, getAuthToken());
			console.log(votes);
			setVotes(votes);
		}

		async function fetchChanges() {
			const { changes } = await getUserChanges(userProfile.uid, getAuthToken());
			console.log(changes);
			setChanges(changes);
		}

		fetchVotes();
		fetchChanges();
	}, [userProfile]);

	return (
		<MainLayout>
			<main className="container mx-auto px-4 py-8 max-w-3xl">
				<ProfileCard profile={userProfile} ownProfile={true} votes={votes} changes={changes} />
			</main>
		</MainLayout>
	);
}

export const getServerSideProps = async ({req}) => {
	const sessionJWT = req.cookies["x_d_jwt"];
    const { userProfile, roles } = await getOwnUserProfile(sessionJWT);
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