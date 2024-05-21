import {useRouter} from "next/router";
import {authStytchRequest} from "@/lib/stytch";
import {getProject} from "@/lib/project";
import {getDocument, getDocumentChanges} from "@/lib/document";
import {getChangeVotes} from "@/lib/change";
import {NewLayout} from "@/components/NewLayout";
import {ChangeCard} from "@/components/custom/ChangeCard";
import {initializeStore} from "@/lib/store";
import {getUserProfile, getUserRoles} from "@/lib/user";

export default function Index({project, document, changesWithVotes}) {
	const router = useRouter();

	console.log("Project: ", project);
	console.log("Document: ", document);
	console.log("Changes with Votes: ", changesWithVotes);


	return (
		<NewLayout>
			<div
				className="flex flex-col self-center px-20 py-8 w-full bg-white h-screen border rounded-3xl max-md:px-5 max-md:max-w-full">
				<div className="flex w-full mt-8 text-4xl font-extrabold ">{document.name}</div>
				{/*TODO: Uncomment once lastEdit is served with document*/}
				{/*<div className="self-start mt-2 text-sm leading-5 text-zinc-500">*/}
				{/*	Last edit {new Date(document.lastEdit).toLocaleDateString('en-US', {*/}
				{/*	day: 'numeric',*/}
				{/*	month: 'long',*/}
				{/*	year: 'numeric'*/}
				{/*})}*/}
				{/*</div>*/}

				<section className="mt-3 max-md:max-w-full py-4">
					<h2 className="text-xl text-neutral-950 py-2">Ongoing</h2>
					<div className="flex gap-5 max-md:flex-col max-md:gap-0">
						{changesWithVotes.some(change => !change.closed && !change.merged) ? (
							changesWithVotes.map((change, index) => (
								(!change.closed && !change.merged) && (
									<ChangeCard
										key={index}
										className="py-8 border-b-2 cursor-pointer"
										change={change}
										onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote/${change.cid}`)}
									/>
								)
							))
						) : (
							<div className="p-4 justify-between items-center">
								No ongoing changes
							</div>
						)}
					</div>
				</section>
				<section className="mt-3 max-md:max-w-full py-4">
					<h2 className="text-xl text-neutral-950 py-2">Completed</h2>
					<div className="flex gap-5 max-md:flex-col max-md:gap-0">
						{changesWithVotes.some(change => change.closed || change.merged) ? (
							changesWithVotes.map((change, index) => (
								(change.closed || change.merged) && (
									<ChangeCard
										key={index}
										change={change}
										onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote/${change.cid}`)}
									/>
								)
							))
						) : (
							<div className="p-4 justify-between items-center">
								No completed changes
							</div>
						)}
					</div>
				</section>
			</div>
		</NewLayout>
	);
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
	const {userProfile} = await getUserProfile(session.user_id, sessionJWT);
  if (!userProfile) {
    return {
      redirect: {
        destination: "/onboard",
        permanent: false,
      },
    };
  }

	const project = await getProject(pid, sessionJWT);
	console.log("Project: ", project);
	const document = await getDocument(documentId, sessionJWT);
	console.log("Document: ", document);
	if (!project || !document) {
		return {
			redirect: {
				destination: `/projects`,
				permanent: false,
			},
		};
	}
	const publishedChanges = await getDocumentChanges(documentId, {"published": true}, sessionJWT);
	console.log("Document Changes: ", publishedChanges);
	const changesWithVotes = await Promise.all(
		publishedChanges.map(async (change) => {
			const votes = await getChangeVotes(change.cid, {}, sessionJWT);
			return {
				...change,
				votes,
			};
		})
	);
	console.log("Changes with Votes: ", changesWithVotes);

	const userRoles = await getUserRoles(session.user_id, sessionJWT);
	const zustandServerStore = initializeStore({
		userProfile,
		userRoles,
    currentProject: pid,
	});

	return {
		props: {
			project: project,
			document: document,
			changesWithVotes: changesWithVotes,
			initialZustandState: JSON.parse(
				JSON.stringify(zustandServerStore.getState())
			),
		},
	};
};
