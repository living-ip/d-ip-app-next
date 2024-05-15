import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {authStytchRequest} from "@/lib/stytch";
import {useState} from "react";
import {Dialog, DialogContent, DialogTrigger,} from "@/components/ui/dialog";
import {createDocumentChange, getDocument, getDocumentChanges} from "@/lib/document";
import {convertNameToGithubRepo} from "@/lib/utils";
import {getProject} from "@/lib/project";
import {getCookie} from "cookies-next";
import {getUserRoles} from "@/lib/user";
import {initializeStore, useStore} from "@/lib/store";
import {NewLayout} from "@/components/NewLayout";
import {TbArrowsSort} from "react-icons/tb";
import {FiEdit3} from "react-icons/fi";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {DocumentEditCard} from "@/components/custom/DocumentEditCard";


export default function Index({project, document, changes}) {
	const router = useRouter();
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) =>
		[state.userRoles, state.setInvalidPermissionsDialogOpen]
	);
	const [name, setName] = useState("");
	const [nameFilled, setNameFilled] = useState(false);
	const [description, setDescription] = useState("");
	const [descriptionFilled, setDescriptionFilled] = useState(false);
	const [filteredStatus, setFilteredStatus] = useState("not-published");

	const newEditHandler = async (document) => {
		const change = await createDocumentChange(
			document.did,
			{
				name: name,
				description: description,
			},
			getCookie("stytch_session_jwt")
		);
		await router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/edit/${change.cid}`);
	};

	return (
		<NewLayout>
			<main
				className="flex flex-col self-center px-8 py-8 w-full h-screen bg-white rounded-3xl shadow max-md:px-5 max-md:max-w-full">
				<div className="flex gap-4 justify-between max-md:flex-wrap max-md:max-w-full">
					<div className="flex flex-col">
						<h1 className="text-3xl leading-9 text-neutral-950">
							{document.name}
						</h1>
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
										{!nameFilled && (
											<>
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
												<Button disabled={!name} onClick={() => setNameFilled(true)}>Continue</Button>
											</>
										)}
										{nameFilled && !descriptionFilled && (
											<>
												<div className="flex flex-col justify-center items-center py-8">
													<div className="mb-2 text-4xl">Add description</div>
													<div>Write a description to summarise your edit.</div>
												</div>
												<Textarea
													placeholder="Enter the change description"
													id="description"
													value={description}
													onChange={(e) =>
														setDescription(e.target.value)
													}
												/>
												<Button type="submit" disabled={!description} onClick={() => newEditHandler(document)}>
													Create Edit
												</Button>
											</>
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
							<div key={index} onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${encodeURIComponent(document.did)}/vote/${encodeURIComponent(change.cid)}`)}>
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
		</NewLayout>
	)

}

export const getServerSideProps = async ({
	                                         req, query
                                         }) => {
	const {session} = await authStytchRequest(req);
	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	const {pid, documentId} = query;
	console.log("Pid: ", pid);
	console.log("Document ID: ", documentId);

	const sessionJWT = req.cookies["stytch_session_jwt"];

	const project = await getProject(pid, sessionJWT);
	console.log("Project: ", project);
	const document = await getDocument(documentId, sessionJWT);
	console.log("Document: ", document);
	const userChanges = await getDocumentChanges(documentId, {
		"user_id": session.user_id,
	}, sessionJWT);
	console.log("User Changes: ", userChanges);

	const orderedChanges = userChanges.sort((a, b) => {
		return new Date(b.updatedAt) - new Date(a.updatedAt);
	});
	console.log("Ordered Changes: ", orderedChanges);

	const userRoles = await getUserRoles(session.user_id, sessionJWT);
	console.log("User Roles: ", userRoles);

	const zustandServerStore = initializeStore({
		userRoles,
		currentProject: pid,
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
