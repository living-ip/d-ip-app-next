import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/user";
import {useRouter} from "next/router";
import {getProjects} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";
import {YourProjectCard} from "@/components/custom/YourProjectCard";
import {OtherProjectCard} from "@/components/custom/OtherProjectCard";
import {NewLayout} from "@/components/NewLayout";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Projects({projects}) {
	const router = useRouter();
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) =>
		[state.userRoles, state.setInvalidPermissionsDialogOpen]
	);

	const desiredOrder = [
		"Claynosaurz",
		"Renaissance Hackathon Demo",
		"Build Republic",
		"LivingIP",
		"LivingIP Product"
	];

	const sortedProjects = [...projects].sort((a, b) => {
		const indexA = desiredOrder.indexOf(a.name);
		const indexB = desiredOrder.indexOf(b.name);

		if (indexA === -1 && indexB === -1) {
			return 0;
		} else if (indexA === -1) {
			return 1;
		} else if (indexB === -1) {
			return -1;
		} else {
			return indexA - indexB;
		}
	});

	// Filter projects based on user roles
	const yourProjects = sortedProjects.filter(project =>
		userRoles.find(role => role.project === project.pid)
	);

// Projects in which the user doesn't have a role
	const otherProjects = sortedProjects.filter(project =>
		!userRoles.find(role => role.project === project.pid)
	);

	return (
		<NewLayout>
			<main
				className="flex flex-col px-20 py-8 w-full h-auto bg-white rounded-3xl shadow max-md:px-5 max-md:max-w-full">
				<div className={"justify-between flex"}>
					<h1 className="text-3xl text-neutral-950 max-md:max-w-full">Projects</h1>
					<Link href={"/projects/new"}>
						<Button>Create Project</Button>
					</Link>
				</div>
				<h2 className="mt-6 text-xl text-neutral-950 max-md:max-w-full">Your projects</h2>
				<div className="mt-4 max-md:max-w-full">
					<div className="grid grid-cols-2 2xl:grid-cols-3 gap-5 max-md:grid-cols-1 max-md:gap-0">
						{yourProjects.map((project, index) => (
							<YourProjectCard key={index} project={project}/>
						))}
					</div>
				</div>
				{otherProjects.length > 0 && (
					<>
						<h2 className="mt-6 text-xl text-neutral-950 max-md:max-w-full">Other projects</h2>
						{otherProjects.map((project, index) => (
							<OtherProjectCard key={index} project={project}/>
						))}
					</>
				)}
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
