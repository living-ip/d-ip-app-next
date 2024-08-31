import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/user";
import {getProjects} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";
import {YourProjectCard} from "@/components/cards/YourProjectCard";
import {OtherProjectCard} from "@/components/cards/OtherProjectCard";
import {MainLayout} from "@/components/layouts/MainLayout";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";

const desiredOrder = [
	"Claynosaurz",
	"Renaissance Hackathon Demo",
	"Build Republic",
	"LivingIP",
	"LivingIP Product"
];

export default function Projects({projects}) {
	const userRoles = useStore((state) => state.userRoles);
	const {isAuthenticated} = useDynamicContext()

	const sortProjects = (projectList) => {
		return [...projectList].sort((a, b) => {
			const indexA = desiredOrder.indexOf(a.name);
			const indexB = desiredOrder.indexOf(b.name);
			return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
		});
	};

	const yourProjects = sortProjects(
		projects.filter(project => userRoles.some(role => role.project === project.pid))
	);

	const otherProjects = sortProjects(
		projects.filter(project => !userRoles.some(role => role.project === project.pid))
	);

	return (
		<MainLayout>
			<main className="flex flex-col px-5 sm:px-10 lg:px-20 py-8 w-full h-auto bg-white rounded-3xl shadow">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl sm:text-3xl text-neutral-950">Projects</h1>
					{
						isAuthenticated && (
							<Link href="/projects/new">
								<Button>Create Project</Button>
							</Link>
						)
					}
				</div>
				<h2 className="mt-6 text-xl text-neutral-950">Your projects</h2>
				<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
					{yourProjects.map((project) => (
						<YourProjectCard key={project.pid} project={project}/>
					))}
				</div>
				{yourProjects.length === 0 && (
					<p className="mt-4 text-neutral-600">{"You don't have access to any projects yet."}</p>
				)}

				<h2 className="mt-10 text-xl text-neutral-950">Other projects</h2>
				<div className="mt-4 space-y-4">
					{otherProjects.map((project) => (
						<OtherProjectCard key={project.pid} project={project}/>
					))}
				</div>
				{otherProjects.length === 0 && (
					<p className="mt-4 text-neutral-600">There are no other projects available at the moment.</p>
				)}
			</main>
		</MainLayout>
	);
}

export const getServerSideProps = async ({req}) => {
	const dynamicAuthToken = req.cookies["x_d_jwt"];
	let user = {user: {}, userProfile: {}, roles: []}
	let projects
	if (dynamicAuthToken) {
		[user, projects] = await Promise.all([
			getUserProfile("TODO", dynamicAuthToken),
			getProjects(dynamicAuthToken),
		]);
		const {userProfile} = user;
		if (!userProfile) {
			return {
				redirect: {
					destination: "/onboard",
					permanent: false,
				},
			};
		}
	} else {
		[projects] = await Promise.all([
			getProjects(),
		]);
	}
	const {userProfile, roles} = user;
	const zustandServerStore = initializeStore({
		userProfile,
		userRoles: roles,
		currentProject: undefined,
	});
	return {
		props: {
			projects,
			initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
		},
	};
};