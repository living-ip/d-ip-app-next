import {Card, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile, getUserRoles} from "@/lib/user";
import {Layout} from "@/components/ui/layout";
import {getProject, getProjectDocuments} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";

const DocumentCards = ({project, documents}) => {
	const router = useRouter();
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) =>
		[state.userRoles, state.setInvalidPermissionsDialogOpen]
	);

	return (
		<Layout>
			<div className="my-10 flex justify-between items-center w-full">
				<div className="flex flex-col mr-4 w-full">
					<div className={"flex mb-4 justify-between items-center w-full"}>
						<div className={"text-4xl font-extrabold"}>{project.name}</div>
						<Button onClick={() => {
							if (!userRoles.find((role) => role.project === project.pid && role.role.create_document)) {
								setInvalidPermissionsDialogOpen(true);
								return;
							}
							router.push(`/projects/${encodeURI(project.pid)}/new`)
						}}
						>
							Create New Document
						</Button>
					</div>
					<div className={"text-lg"}>{project.description}</div>
				</div>
			</div>
			<div className="flex flex-col w-full overflow-auto mb-16">
				<div className="flex flex-wrap -mx-2">
					{documents.map((document, index) => {
						const cardStyle = document.draft ? "bg-gray-200 no-shadow" : "";
						const titleStyle = document.draft ? "text-gray-500 italic" : "";
						const imageStyle = document.draft ? "blur-sm" : "";
						const documentName = document.draft ? "Document Under Review" : document.name;
						const documentDescription = document.draft
							? "This document is currently under review by the community. Please check back later."
							: document.description;
						return (
							<div
								key={index}
								className={`w-full sm:w-1 md:w-1/2 lg:w-1/2 xl:w-1/3 px-2 mb-8`}
							>
								<Card className={cardStyle}>
									<CardHeader>
										<CardTitle className={titleStyle}>{documentName}</CardTitle>
										<div className="flex flex-col justify-between h-full">
											<CardDescription>{documentDescription}</CardDescription>
											<div className="flex justify-between mt-auto">
												<Button onClick={() =>
													router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}`)}>
													Read it
												</Button>
												<Button variant="outline"
												        onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote`)}>
													See Changes
												</Button>
											</div>
										</div>
									</CardHeader>
								</Card>
							</div>
						);
					})}
				</div>
			</div>
		</Layout>
	);
};

export default DocumentCards;

export const getServerSideProps = async ({req, query}) => {
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

	const {pid} = query;
	console.log("pid: ", pid)
	const project = await getProject(pid, sessionJWT);
	console.log("Project: ", project)
	if (!project) {
		return {
			redirect: {
				destination: "/projects",
				permanent: false,
			},
		};
	}

	const documents = await getProjectDocuments(project.pid, sessionJWT)
	console.log("Documents: ", documents);

	const userRoles = await getUserRoles(session.user_id, sessionJWT);
	console.log("User Roles: ", userRoles);

	const zustandServerStore = initializeStore({
		userProfile,
		userRoles,
		currentProject: pid,
	});

	return {
		props: {
			project: project,
			documents: documents,
			initialZustandState: JSON.parse(
				JSON.stringify(zustandServerStore.getState())
			),
		},
	};
};
