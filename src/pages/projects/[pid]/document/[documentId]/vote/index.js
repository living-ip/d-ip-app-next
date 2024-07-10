import {useRouter} from "next/router";
import {authStytchRequest} from "@/lib/stytch";
import {getProject} from "@/lib/project";
import {getDocument, getDocumentChanges} from "@/lib/document";
import {getChangeVotes} from "@/lib/change";
import {NewLayout} from "@/components/NewLayout";
import {ChangeCard} from "@/components/custom/ChangeCard";
import {initializeStore} from "@/lib/store";
import {getUserProfile} from "@/lib/user";

export default function Index({project, document, changesWithVotes}) {
	const router = useRouter();

	const renderChangeCards = (changes) => (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{changes.map((change, index) => (
				<ChangeCard
					key={index}
					change={change}
					onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote/${change.cid}`)}
				/>
			))}
		</div>
	);

	const ongoingChanges = changesWithVotes.filter(change => !change.closed && !change.merged);
	const completedChanges = changesWithVotes.filter(change => change.closed || change.merged);

	return (
		<NewLayout>
			<div className="container mx-auto px-4 py-8 bg-white min-h-screen">
				<h1 className="text-4xl font-extrabold mb-2">{document.name}</h1>
				{/* TODO: Uncomment once lastEdit is served with document */}
				{/* <p className="text-sm text-zinc-500 mb-6">
          Last edit {new Date(document.lastEdit).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p> */}

				<section className="mb-8">
					<h2 className="text-xl font-semibold text-neutral-950 mb-4">Ongoing</h2>
					{ongoingChanges.length > 0 ? (
						renderChangeCards(ongoingChanges)
					) : (
						<p className="text-gray-500">No ongoing changes</p>
					)}
				</section>

				<section>
					<h2 className="text-xl font-semibold text-neutral-950 mb-4">Completed</h2>
					{completedChanges.length > 0 ? (
						renderChangeCards(completedChanges)
					) : (
						<p className="text-gray-500">No completed changes</p>
					)}
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

	const {pid, documentId} = query

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

	const [project, document] = await Promise.all([
		getProject(pid, sessionJWT),
		getDocument(documentId, sessionJWT)
	]);
	if (!project || !document) {
		return {
			redirect: {
				destination: `/projects`,
				permanent: false,
			},
		};
	}

	const publishedChanges = await getDocumentChanges(documentId, {"published": true}, sessionJWT);

	const changesWithVotes = await Promise.all(
		publishedChanges.map((change) =>
			getChangeVotes(change.cid, {}, sessionJWT).then(votes => ({
				...change,
				votes,
			}))
		)
	);

	const zustandServerStore = initializeStore({
		userProfile,
		userRoles: roles,
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
