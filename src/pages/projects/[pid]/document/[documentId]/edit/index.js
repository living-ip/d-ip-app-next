import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {useState} from "react";
import {Dialog, DialogContent, DialogTrigger,} from "@/components/ui/dialog";
import {createDocumentChange, getDocument, getDocumentChanges} from "@/lib/document";
import {convertNameToGithubRepo} from "@/lib/utils";
import {getProject} from "@/lib/project";
import {getOwnUserProfile} from "@/lib/user";
import {initializeStore, useStore} from "@/lib/store";
import {MainLayout} from "@/components/layouts/MainLayout";
import {TbArrowsSort} from "react-icons/tb";
import {FiEdit3} from "react-icons/fi";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {DocumentEditCard} from "@/components/cards/DocumentEditCard";
import {Loader2} from "lucide-react";
import {IoArrowBackOutline} from "react-icons/io5";
import {getAuthToken} from "@dynamic-labs/sdk-react-core";


export default function Index({project, document, changes}) {
	const router = useRouter();
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) =>
		[state.userRoles, state.setInvalidPermissionsDialogOpen]
	);
	const [name, setName] = useState("");
	const [filteredStatus, setFilteredStatus] = useState("not-published");

	const [loading, setLoading] = useState(false)

	const newEditHandler = async (document) => {
		setLoading(true)
		const change = await createDocumentChange(
			document.did,
			{
				name: name,
			},
			getAuthToken()
		);
		await router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/edit/${change.cid}`);
		setLoading(false)
	};

	return (
		<MainLayout>
			<main
				className="flex flex-col self-center px-8 py-8 w-full h-screen bg-white rounded-3xl shadow max-md:px-5 max-md:max-w-full">
				<div className="flex gap-4 justify-between max-md:flex-wrap max-md:max-w-full">
					<div className="flex flex-col">
						<div className="flex gap-3 max-md:flex-wrap">
							<Button variant="outline" className="p-2.5 rounded-sm border border-gray-200 border-solid">
								<IoArrowBackOutline className="w-4 h-4 cursor-pointer"
								                    onClick={() => router.push(`/projects/${router.query.pid}/document/${router.query.documentId}`)}/>
							</Button>
							<h1 className="text-3xl leading-9 text-neutral-950">
								{document.name}
							</h1>
						</div>

						{/*TODO: Ben - have backend serve this information*/}
						<div className="mt-2 text-sm leading-5 text-zinc-500">
							{document.lastEdit}
						</div>
					</div>
					<Dialog>
						{userRoles.find((role) => role.project === project.pid && role.role.create_change) ? (
							<DialogTrigger asChild>
								<Button>New Change</Button>
							</DialogTrigger>
						) : (
							<>
								<Button onClick={() => setInvalidPermissionsDialogOpen(true)}>
									New Change
								</Button>
							</>
						)}
						<DialogContent className="min-w-full h-screen justify-center items-center">
							<div className={"flex flex-col"}>
								<div className="flex flex-col justify-center items-center max-md:px-5">
									<div className="flex flex-col gap-y-2 items-center max-w-full">
										<FiEdit3
											className="w-12 h-12 p-2 items-center justify-center shadow-md rounded-lg stroke-white bg-[#245D00] border-2 border-[#D7E2D0]"/>
										<div className="flex flex-col justify-center items-center py-8">
											<div className="mb-2 text-4xl">Name the edit</div>
											<div>Choose a fitting and understandable name for your edit.</div>
										</div>
										<Input
											placeholder="Enter the name of the edit"
											id="name"
											value={name}
											onChange={(e) =>
												setName(convertNameToGithubRepo(e.target.value))
											}
										/>
										{loading ? (
											<Button className={"bg-[#245D00]"} disabled>
												<Loader2 className="mr-2 h-4 w-4 animate-spin"/>
												Please wait
											</Button>
										) : (
											<Button type="submit" disabled={!name}
											        onClick={() => newEditHandler(document)}>
												Create Edit
											</Button>
										)}
									</div>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
				<div className="flex gap-2.5 justify-between mt-6 w-full max-md:flex-wrap max-md:max-w-full">
					<h2 className="text-xl leading-7 text-neutral-950">Edits ({changes.length})</h2>
					{changes.length > 4 && (
						// TODO: Implement sort functionality
						<div
							className="flex gap-1 px-3 py-1 text-sm font-medium leading-5 text-center border border-gray-200 border-solid rounded-[100px] text-neutral-600">
							<TbArrowsSort className="w-4 h-4 shrink-0 my-auto aspect-square"/>
							<div>Sort by</div>
						</div>
					)}
				</div>
				{
					changes.map((change, index) => (
						change.published ?
							<div key={index} className="cursor-pointer"
							     onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${encodeURIComponent(document.did)}/vote/${encodeURIComponent(change.cid)}`)}>
								<DocumentEditCard
									key={index}
									project={project}
									document={document}
									change={change}
								/>
							</div>
							:
							<DocumentEditCard
								key={index}
								project={project}
								document={document}
								change={change}
							/>
					))
				}
			</main>
		</MainLayout>
	)

}

export const getServerSideProps = async ({req, query}) => {
	const {pid, documentId} = query;
	const sessionJWT = req.cookies["x_d_jwt"];
	const {userProfile, roles} = await getOwnUserProfile(sessionJWT);

	const [project, document, userChangesRaw] = await Promise.all([
		getProject(pid, sessionJWT),
		getDocument(documentId, sessionJWT),
		getDocumentChanges(documentId, {"user_id": userProfile.uid}, sessionJWT)
	]);

	const orderedChanges = userChangesRaw.sort((a, b) => {
		return new Date(b.updatedAt) - new Date(a.updatedAt);
	});

	const zustandServerStore = initializeStore({
		userRoles: roles,
		currentProject: pid,
		user: userProfile,
	});

	return {
		props: {
			project: project,
			document: document,
			changes: orderedChanges,
			initialZustandState: JSON.parse(
				JSON.stringify(zustandServerStore.getState())
			),
		},
	};
};
