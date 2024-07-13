import {useState} from "react";
import {authStytchRequest} from "@/lib/stytch";
import {parseDiff} from "react-diff-view";
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
import VoteTimeRemainingBadge from "@/components/custom/VoteTimeRemainingBadge";

const DiffLine = ({type, content}) => {
	const bgColor = type === 'insert' ? 'bg-green-100' : type === 'delete' ? 'bg-red-100' : 'bg-gray-100';
	const textColor = type === 'insert' ? 'text-green-800' : type === 'delete' ? 'text-red-800' : 'text-gray-800';

	return (
		<div className={`${bgColor} ${textColor} px-4 py-1 font-mono text-sm whitespace-pre-wrap break-all`}>
			{type === 'insert' && '+ '}
			{type === 'delete' && '- '}
			{content}
		</div>
	);
};

const DiffFile = ({oldRevision, newRevision, type, hunks}) => {
	return (
		<div className="mb-4">
			<div>
				{hunks.map((hunk, index) => (
					<div key={index} className="border-t border-gray-200">
						{hunk.changes.map((change, changeIndex) => (
							<DiffLine key={changeIndex} type={change.type} content={change.content}/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default function Index({project, document, change, changeVotes, userVoteProp}) {
	const router = useRouter();
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) => [
		state.userRoles,
		state.setInvalidPermissionsDialogOpen,
	]);
	const [userVote, setUserVote] = useState(userVoteProp);

	const files = parseDiff(change.diff_data);

	const voteTimeLeft = change.vote_timeout - Date.now();

	const userCanVote = () => {
		if (!userRoles.find((role) => role.project === project.pid && role.role.vote_on_change)) {
			setInvalidPermissionsDialogOpen(true);
			return false;
		}
		return true;
	};

	const ResultsSection = () => (
		<>
			<h2 className="mt-4 text-lg font-semibold">Results</h2>
			<AwaitResults/>
		</>
	);

	return (
		<NewLayout>
			<div className="flex flex-col justify-center pb-6 bg-neutral-100">
				<main
					className="flex flex-col items-start p-8 w-full bg-white rounded-3xl shadow-md max-md:px-5 max-md:max-w-full">
					<div className="flex gap-3 items-center max-md:flex-wrap">
						<Button variant="outline" className="p-2.5 rounded-sm border border-gray-200 border-solid"
						        onClick={() => router.back()}>
							<IoArrowBackOutline className="w-4 h-4 cursor-pointer"/>
						</Button>
						<h1 className="text-3xl font-bold leading-9 text-neutral-950 max-md:max-w-full">{document.name}</h1>
					</div>
					<div className="flex mt-2 space-x-2">
						{voteTimeLeft > 0 ? (
							<>
								<VotePageBadge>Voting Ongoing</VotePageBadge>
								<VoteTimeRemainingBadge change={change}/>
							</>
						) : (
							<VotePageBadge>Voting Closed</VotePageBadge>
						)}
					</div>
					<p className="mt-2 text-sm text-neutral-600 w-full max-w-3xl">{change.description}</p>
					<section className="mt-7 mb-40 w-full max-md:mb-10">
						<div className="flex gap-5 max-md:flex-col">
							<article className="flex flex-col w-2/3 max-md:w-full">
								<div className="w-full max-h-screen overflow-x-auto overflow-y-auto">
									{files.map((file, index) => (
										<DiffFile key={index} {...file} />
									))}
								</div>
							</article>
							<aside className="flex flex-col w-1/3 max-md:w-full">
								{change.closed || change.merged ? (
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