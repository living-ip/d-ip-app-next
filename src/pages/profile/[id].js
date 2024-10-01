import * as React from "react";
import {useState, useEffect} from "react";
import {ProfileCard} from "@/components/cards/ProfileCard";
import {MainLayout} from "@/components/layouts/MainLayout";
import {getOwnUserProfile, getUserChanges, getUserProfile, getUserVotes} from "@/lib/user";
import {initializeStore} from "@/lib/store";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";

export default function ProfilePage({userId}) {
  const [userProfile, setUserProfile] = useState({});
	const [votes, setVotes] = useState([]);
	const [changes, setChanges] = useState([]);

	useEffect(() => {
		async function fetchUserProfile() {
      const { user } = await getUserProfile(userId, getAuthToken());
      console.log(user);
      setUserProfile(user);
    }
		async function fetchVotes() {
			const { votes } = await getUserVotes(userId, getAuthToken());
			setVotes(votes);
		}

		async function fetchChanges() {
			const { changes } = await getUserChanges(userId, getAuthToken());
			setChanges(changes);
		}

    fetchUserProfile();
		fetchVotes();
		fetchChanges();
	}, [userId]);

	return (
		<MainLayout>
			<main className="container mx-auto px-4 py-8 max-w-3xl">
				<ProfileCard profile={userProfile} ownProfile={false} votes={votes} changes={changes} />
			</main>
		</MainLayout>
	);
}

export const getServerSideProps = async ({req, query}) => {
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
	const zustandServerStore = initializeStore({
		userProfile,
		userRoles: roles,
		currentProject: undefined,
	});
	return {
		props: {
			initialZustandState: JSON.parse(
				JSON.stringify(zustandServerStore.getState())
			),
      userId: query.id,
		},
	};
};