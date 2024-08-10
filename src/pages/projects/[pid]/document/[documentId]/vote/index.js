import {useRouter} from "next/router";
import {authStytchRequest} from "@/lib/stytch";
import {getProject} from "@/lib/project";
import {getDocument, getDocumentChanges} from "@/lib/document";
import {getChangeVotes} from "@/lib/change";
import {NewLayout} from "@/components/NewLayout";
import {ChangeCard} from "@/components/cards/ChangeCard";
import {initializeStore} from "@/lib/store";
import {getUserProfile} from "@/lib/user";
import {Button} from "@/components/ui/button";
import {IoArrowBackOutline} from "react-icons/io5";

export default function Index({project, document, changesWithVotes}) {
	const router = useRouter();

	const renderChangeCards = (changes) => (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
			<div
				className="flex flex-col self-center px-4 sm:px-8 md:px-20 py-8 w-full bg-white min-h-screen border rounded-3xl">
				<section className="flex flex-col md:flex-row gap-3 justify-between w-full">
					<div className="flex flex-col w-full">
						<div className="flex gap-3 items-center flex-wrap">
							<Button variant="outline" className="p-2.5 rounded-sm border border-gray-200 border-solid">
								<IoArrowBackOutline className="w-4 h-4 cursor-pointer" onClick={() => router.back()}/>
							</Button>
							<h1 className="text-2xl sm:text-3xl leading-9 text-neutral-950">{document.name}</h1>
						</div>
						<p className="mt-3 text-base leading-6 text-neutral-600">
							{document.description}
						</p>
					</div>
				</section>
				<section className="mt-6 w-full">
					<h2 className="text-xl text-neutral-950 py-2">Ongoing</h2>
					{ongoingChanges.length > 0 ? (
						renderChangeCards(ongoingChanges)
					) : (
						<div className="p-4 text-center text-neutral-600">
							No ongoing changes
						</div>
					)}
				</section>

				<section className="mt-6 w-full">
					<h2 className="text-xl text-neutral-950 py-2">Completed</h2>
					{completedChanges.length > 0 ? (
						renderChangeCards(completedChanges)
					) : (
						<div className="p-4 text-center text-neutral-600">
							No completed changes
						</div>
					)}
				</section>
			</div>
		</NewLayout>
	);
}


export const getServerSideProps = async ({
	                                         req, query
                                         }) => {
	const {pid, documentId} = query

	const sessionJWT = req.cookies["x_d_jwt"];
    const { userProfile, roles } = await getUserProfile("TODO", sessionJWT);
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
