import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/user";
import {getProjects} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";
import {YourProjectCard} from "@/components/custom/YourProjectCard";
import {OtherProjectCard} from "@/components/custom/OtherProjectCard";
import {NewLayout} from "@/components/NewLayout";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const desiredOrder = [
	"Claynosaurz",
	"Renaissance Hackathon Demo",
	"Build Republic",
	"LivingIP",
	"LivingIP Product"
];
export default function Projects({projects}) {
	const userRoles = useStore((state) => state.userRoles);
	const sortedProjects = [...projects].sort((a, b) => {
		const indexA = desiredOrder.indexOf(a.name);
		const indexB = desiredOrder.indexOf(b.name);
		return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
	});
	const yourProjects = sortedProjects.filter(project =>
		userRoles.some(role => role.project === project.pid)
	);
	const otherProjects = sortedProjects.filter(project =>
		!userRoles.some(role => role.project === project.pid)
	);
	return (
		<NewLayout>
			<main className="flex flex-col px-5 sm:px-10 lg:px-20 py-8 w-full h-auto bg-white rounded-3xl shadow">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl sm:text-3xl text-neutral-950">Projects</h1>
					<Link href="/projects/new">
						<Button>Create Project</Button>
					</Link>
				</div>
				<h2 className="mt-6 text-xl text-neutral-950">Your projects</h2>
				<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
					{yourProjects.map((project) => (
						<YourProjectCard key={project.pid} project={project}/>
					))}
				</div>
				{otherProjects.length > 0 && (
					<>
						<h2 className="mt-10 text-xl text-neutral-950">Other projects</h2>
						<div className="mt-4 space-y-4">
							{otherProjects.map((project) => (
								<OtherProjectCard key={project.pid} project={project}/>
							))}
						</div>
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
	const [user, projects] = await Promise.all([
		getUserProfile(session.user_id, sessionJWT),
		getProjects(sessionJWT),
	]);
	const {userProfile, roles} = user;
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
			projects,
			initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
		},
	};
};