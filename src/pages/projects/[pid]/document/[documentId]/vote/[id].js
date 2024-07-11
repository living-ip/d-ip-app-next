import {useState} from "react";
import {authStytchRequest} from "@/lib/stytch";
import {Diff, Hunk, parseDiff} from "react-diff-view";
import "react-diff-view/style/index.css";
import {getChange, getChangeVotes} from "@/lib/change";
import {getProject} from "@/lib/project";
import {getDocument} from "@/lib/document";
import {getUserProfile} from "@/lib/user";
import {initializeStore, useStore} from "@/lib/store";
import {VotingForm} from "@/components/custom/VotingForm";
import {NewLayout} from "@/components/NewLayout";
import {VotePageBadge} from "@/components/custom/VotePageBadge";
import {ResultsCard} from "@/components/custom/ResultsCard";
import {AwaitResults} from "@/components/custom/AwaitResults";
import {Button} from "@/components/ui/button";
import {IoArrowBackOutline} from "react-icons/io5";
import {useRouter} from "next/router";

export default function Index({project, document, change, changeVotes, userVoteProp}) {
	const router = useRouter();
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) => [
		state.userRoles,
		state.setInvalidPermissionsDialogOpen,
	]);
	const [userVote, setUserVote] = useState(userVoteProp);

	const files = parseDiff(change.diff_data);

	const renderFile = ({oldRevision, newRevision, type, hunks}) => (
		<Diff
			key={oldRevision + "-" + newRevision}
			viewType="unified"
			diffType={type}
			hunks={hunks}
		>
			{(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk}/>)}
		</Diff>
	);

	const getTimeBadge = (remainingTime) => {
		const minutes = Math.floor(remainingTime / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (remainingTime <= 0) return "Expired";
		if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''}`;
		if (hours < 24) return `${hours} hr${hours !== 1 ? 's' : ''}`;
		return `${days} day${days !== 1 ? 's' : ''}`;
	};

	const userCanVote = () => {
		if (!userRoles.find((role) => role.project === project.pid && role.role.vote_on_change)) {
			setInvalidPermissionsDialogOpen(true);
			return false;
		}
		return true;
	};

	const ResultsSection = () => (
		<>
			<h2 className="mt-4 text-lg">Results</h2>
			<AwaitResults/>
		</>
	);

	return (
		<NewLayout>
			<div className="flex flex-col justify-center pb-6 bg-neutral-100">
				<main
					className="flex flex-col items-start p-8 w-full bg-white rounded-3xl max-md:px-5 max-md:max-w-full">
					<div className="flex gap-3 max-md:flex-wrap">
						<Button variant="outline" className="p-2.5 rounded-sm border border-gray-200 border-solid">
							<IoArrowBackOutline className="w-4 h-4 cursor-pointer" onClick={() => router.back()}/>
						</Button>
						<div className="text-3xl leading-9 text-neutral-950 max-md:max-w-full">{document.name}</div>
					</div>
					<div className="flex mt-2 space-x-2">
						<VotePageBadge>Vote Ongoing</VotePageBadge>
						{change.time_left_ms && (
							<VotePageBadge>{getTimeBadge(change.time_left_ms)}</VotePageBadge>
						)}
					</div>
					<p className="mt-2 text-sm text-neutral-600 w-full max-w-3xl">{change.description}</p>
					<section className="mt-7 mb-40 w-full max-md:mb-10">
						<div className="flex gap-5 max-md:flex-col">
							<article className="flex flex-col w-2/3 max-md:w-full">
								<div className="w-full max-h-screen overflow-x-auto overflow-y-auto">
									{files.map(renderFile)}
								</div>
							</article>
							<aside className="flex flex-col w-1/3 max-md:w-full">
								{(change.closed || change.merged) ? (
									<ResultsCard change={change} changeVotes={changeVotes}/>
								) : userCanVote() ? (
									<>
										<VotingForm change={change} userVote={userVote} setUserVote={setUserVote}/>
										<ResultsSection/>
									</>
								) : (
									<ResultsSection/>
								)}
							</aside>
						</div>
					</section>
				</main>
			</div>
		</NewLayout>
	);
}

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

	const {pid, documentId, id} = query;
	const sessionJWT = req.cookies["stytch_session_jwt"];

	const [project, document, change, changeVotes] = await Promise.all([
		getProject(pid, sessionJWT),
		getDocument(documentId, sessionJWT),
		getChange(id, sessionJWT),
		getChangeVotes(id, {"include_voters": true}, sessionJWT)
	]);

	if (!project || !document || !change) {
		return {
			redirect: {
				destination: `/projects/${pid}/document/${documentId}`,
				permanent: false,
			},
		};
	}

	const userVote = changeVotes.voters.find((vote) => vote.voter_id === session.user_id);
	const {userProfile, roles} = await getUserProfile(session.user_id, sessionJWT);

	const zustandServerStore = initializeStore({
		userProfile,
		userRoles: roles,
		currentProject: pid,
	});

	return {
		props: {
			project,
			document,
			change,
			changeVotes: changeVotes || {},
			userVoteProp: userVote ? userVote.vote : 0,
			initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
		},
	};
};