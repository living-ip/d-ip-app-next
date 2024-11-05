import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import {getOwnUserProfile} from "@/lib/user";
import {getProject, getProjectDocuments} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";
import {IoArrowBackOutline} from "react-icons/io5";
import {DocumentCard} from "@/components/cards/DocumentCard";
import {CreationCard} from "@/components/cards/CreationCard";
import {MainLayout} from "@/components/layouts/MainLayout";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {getCreationsCampaigns, getProjectCreations} from "@/lib/creations";
import CreationsVotingDialog from "@/components/vote/CreationsVotingDialog";
import ChatSheet from "@/components/chat/ChatSheet";

const CHAT_ENABLED_PROJECTS = [
	"pid-485b248df6064104bd0297ada2239c51",
	"pid-ce6b7d54c03840adb1f5390bbcf55e05"
]

const ProjectHeader = ({projectName, contributorCount}) => {
	const router = useRouter();

	return (
		<div className="flex gap-3 items-center">
			<Button
				variant="outline"
				className="p-2.5 rounded-sm border border-gray-200 border-solid bg-white"
				onClick={() => router.push(`/projects`)}
			>
				<IoArrowBackOutline className="w-4 h-4 cursor-pointer text-black"/>
			</Button>
			<h1 className="text-3xl leading-9 text-white">{projectName}</h1>
		</div>
	);
};

const ProjectDescription = ({description}) => (
	<p className="mt-3 text-base leading-6 text-white max-md:max-w-full">{description}</p>
);

const ProjectPage = ({project, documents, creations, campaigns}) => {
	const router = useRouter();
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) => [
		state.userRoles,
		state.setInvalidPermissionsDialogOpen
	]);

	if (!project || !documents) {
		console.error('Missing required props: project or documents');
		return null;
	}

	const handleCreateNewDocument = () => {
		if (!userRoles.find((role) => role.project === project.pid && role.role.create_document)) {
			setInvalidPermissionsDialogOpen(true);
			return;
		}
		router.push(`/projects/${encodeURI(project.pid)}/new`);
	};

	//TODO: Ben - Update contributorCount to correct count from API
	const contributorCount = "XX";

	return (
		<MainLayout>
			<main className="flex flex-col self-center w-full bg-white rounded-3xl shadow max-md:max-w-full">
				<section
					className="flex flex-row max-md:flex-col gap-3 justify-between max-md:justify-center w-full px-20 py-8 max-md:px-5 rounded-t-3xl"
					style={{
						backgroundImage: `url(${project.image_uri})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						position: 'relative',
					}}
				>
					<div className="absolute inset-0 bg-black opacity-50 rounded-t-3xl"></div>
					<div
						className="relative z-10 flex flex-row max-md:flex-col gap-3 justify-between max-md:justify-center w-full rounded-t-3xl">
						<div className="flex flex-col w-[73%] max-md:w-full">
							<ProjectHeader projectName={project.name} contributorCount={contributorCount}/>
							<ProjectDescription description={project.description}/>
						</div>
						<div className="flex justify-end items-center gap-3 w-[27%] max-md:w-[100%] mt-24 max-md:mt-2">
							{campaigns.length > 0 && (
								<CreationsVotingDialog campaign={campaigns[0]}>
									<Button variant="outline" className="bg-white text-black">
										{campaigns.length} Votes
									</Button>
								</CreationsVotingDialog>
							)}
							{
								CHAT_ENABLED_PROJECTS.includes(project.pid) && (
									<ChatSheet>
										<Button variant={"secondary"}>
											Chat
										</Button>
									</ChatSheet>
								)
							}
							<Button onClick={handleCreateNewDocument}>
								Create New Document
							</Button>
						</div>
					</div>
				</section>
				<article className="mt-6 max-md:max-w-full p-4">
					<div className="hidden md:flex flex-row gap-4">
						<div className={`flex flex-col ${creations.length > 0 ? 'w-2/3' : 'w-full'}`}>
							<h2 className="text-xl leading-7 text-neutral-950 mb-4">Documents</h2>
							<div className="flex flex-col gap-4">
								{documents.map((document, index) => (
									<DocumentCard
										key={document.did || index}
										name={document.name}
										description={document.description}
										lastEditDate={document.last_edit || document.created_at}
										onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}`)}
									/>
								))}
							</div>
						</div>
						{creations.length > 0 && (
							<div className="flex flex-col w-1/3">
								<h2 className="text-xl leading-7 text-neutral-950 mb-4">Creations</h2>
								<div className="grid grid-cols-1 gap-4">
									{creations.map((creation, index) => (
										<CreationCard
											key={creation.did || index}
											creation={creation}
											projectId={project.pid}
										/>
									))}
								</div>
							</div>
						)}
					</div>
					<div className="md:hidden">
						{creations.length > 0 ? (
							<Tabs defaultValue="documents" className="w-full">
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="documents">Documents</TabsTrigger>
									<TabsTrigger value="creations">Creations</TabsTrigger>
								</TabsList>
								<TabsContent value="documents">
									<div className="flex flex-col gap-4">
										{documents.map((document, index) => (
											<DocumentCard
												key={document.did || index}
												name={document.name}
												description={document.description}
												lastEditDate={document.last_edit || document.created_at}
												onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}`)}
											/>
										))}
									</div>
								</TabsContent>
								<TabsContent value="creations">
									<div className="grid grid-cols-1 gap-4">
										{creations.map((creation, index) => (
											<CreationCard
												key={creation.did || index}
												creation={creation}
												projectId={project.pid}
											/>
										))}
									</div>
								</TabsContent>
							</Tabs>
						) : (
							<div className="flex flex-col gap-4">
								{documents.map((document, index) => (
									<DocumentCard
										key={document.did || index}
										name={document.name}
										description={document.description}
										lastEditDate={document.last_edit || document.created_at}
										onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}`)}
									/>
								))}
							</div>
						)}
					</div>
				</article>
			</main>
		</MainLayout>
	);
};

export default ProjectPage;

export const getServerSideProps = async ({req, query}) => {
	const sessionJWT = req.cookies["x_d_jwt"];
	const {userProfile, roles} = await getOwnUserProfile(sessionJWT);
	if (!userProfile) {
		return {
			redirect: {
				destination: "/onboard",
				permanent: false,
			},
		};
	}

	const {pid} = query;
	const project = await getProject(pid, sessionJWT);
	if (!project) {
		return {
			redirect: {
				destination: "/projects",
				permanent: false,
			},
		};
	}
	const [documents, creations, campaigns] = await Promise.all([
		getProjectDocuments(project.pid, sessionJWT),
		getProjectCreations(project.pid, sessionJWT),
		getCreationsCampaigns(project.pid, sessionJWT)
	])
	const zustandServerStore = initializeStore({
		userProfile,
		userRoles: roles,
		currentProject: pid,
	});
	return {
		props: {
			project: project,
			documents: documents,
			creations: creations.creations,
			campaigns: campaigns.campaigns,
			initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
		},
	};
};
