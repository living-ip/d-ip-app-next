import {getOwnUserProfile} from "@/lib/user";
import {getOpenVotingCampaigns, getProjects} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";
import {YourProjectCard} from "@/components/cards/YourProjectCard";
import {OtherProjectCard} from "@/components/cards/OtherProjectCard";
import {MainLayout} from "@/components/layouts/MainLayout";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import Link from "next/link";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {ChevronRight, Vote} from "lucide-react";
import {convertGithubRepoToTitle} from "@/lib/utils";

const DESIRED_ORDER = [
	"Claynosaurz",
	"Renaissance Hackathon Demo",
	"Build Republic",
	"LivingIP",
	"LivingIP Product"
];

export default function Projects({projects, openVotingCampaigns}) {
	const userRoles = useStore((state) => state.userRoles);
	const {isAuthenticated} = useDynamicContext();

	const sortProjects = (projectList) => {
		return projectList.sort((a, b) => {
			const indexA = DESIRED_ORDER.indexOf(a.name);
			const indexB = DESIRED_ORDER.indexOf(b.name);
			return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
		});
	};

	const {yourProjects, otherProjects} = projects.reduce((acc, project) => {
		const isYourProject = userRoles.some(role => role.project === project.pid);
		if (isYourProject) {
			acc.yourProjects.push(project);
		} else {
			acc.otherProjects.push(project);
		}
		return acc;
	}, {yourProjects: [], otherProjects: []});

	const sortedYourProjects = sortProjects(yourProjects);
	const sortedOtherProjects = sortProjects(otherProjects);

	return (
		<MainLayout>
			<main className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-b from-gray-50 to-white">
				<section className="space-y-4">
					<h2 className="text-2xl font-semibold">Active Votes</h2>
					<Carousel className="w-full">
						<CarouselContent className="-ml-2 md:-ml-4">
							{openVotingCampaigns && openVotingCampaigns.map((changeVote) => (
								<CarouselItem key={changeVote.cid} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
									<Card
										className="bg-white hover:bg-gray-50 transition-colors border-none shadow-sm hover:shadow">
										<CardContent className="flex flex-col gap-2 p-4">
											<h3 className="font-semibold truncate">{convertGithubRepoToTitle(changeVote.name)}</h3>
											<p className="text-sm text-gray-600 truncate">{changeVote.description}</p>
											<div className="flex items-center justify-between mt-2">
												<div className="flex items-center text-sm text-gray-500">
													<Vote className="w-4 h-4 mr-1"/>
													{/*TODO impl*/}
													{/*<span>{changeVote.voteCount} votes</span>*/}
												</div>
												<Link
													href={`/projects/${changeVote.document.project_id}/document/${changeVote.document_id}/vote/${changeVote.cid}`}
													className="flex items-center text-sm text-blue-600 hover:underline">
													Vote now
													<ChevronRight className="w-4 h-4 ml-1"/>
												</Link>
											</div>
										</CardContent>
									</Card>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious/>
						<CarouselNext/>
					</Carousel>
				</section>

				<section className="space-y-4">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
						{isAuthenticated && (
							<Link href="/projects/new">
								<Button>Create Project</Button>
							</Link>
						)}
					</div>

					{isAuthenticated && sortedYourProjects.length > 0 && (
						<div className="space-y-4">
							<h2 className="text-xl font-semibold">Your projects</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{sortedYourProjects.map((project) => (
									<YourProjectCard key={project.pid} project={project}/>
								))}
							</div>
						</div>
					)}

					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Other projects</h2>
						<div className="space-y-3">
							{sortedOtherProjects.map((project) => (
								<OtherProjectCard key={project.pid} project={project}/>
							))}
						</div>

						{sortedOtherProjects.length === 0 && (
							<p className="text-gray-600">There are no other projects available at the moment.</p>
						)}
					</div>
				</section>
			</main>
		</MainLayout>
	);
}

export async function getServerSideProps({req}) {
	const dynamicAuthToken = req.cookies["x_d_jwt"];
	let user = {user: {}, userProfile: {}, roles: []};
	let projects;
	let openVotingCampaigns;

	if (dynamicAuthToken) {
		[user, projects, openVotingCampaigns] = await Promise.all([
			getOwnUserProfile(dynamicAuthToken),
			getProjects(dynamicAuthToken),
			getOpenVotingCampaigns(dynamicAuthToken),
		]);
	} else {
		[projects, openVotingCampaigns] = await Promise.all([
			getProjects(),
			getOpenVotingCampaigns(),
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
			openVotingCampaigns: openVotingCampaigns.changes || [],
			initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
		},
	};
}