import {useState} from "react";
import {parseDiff} from "react-diff-view";
import {useRouter} from "next/router";
import {IoArrowBackOutline} from "react-icons/io5";
import {initializeStore, useStore} from "@/lib/store";
import {getChange, getChangeVotes} from "@/lib/change";
import {getProject} from "@/lib/project";
import {getDocument} from "@/lib/document";
import {getOwnUserProfile} from "@/lib/user";
import {MainLayout} from "@/components/layouts/MainLayout";
import {VotingForm} from "@/components/vote/VotingForm";
import {VotePageBadge} from "@/components/badge/VotePageBadge";
import {ResultsCard} from "@/components/cards/ResultsCard";
import {AwaitResults} from "@/components/vote/AwaitResults";
import {Button} from "@/components/ui/button";
import VoteTimeRemainingBadge from "@/components/badge/VoteTimeRemainingBadge";

const DiffLine = ({type, content}) => {
	if (!type || !content) return null;

	const bgColor = type === 'insert' ? 'bg-green-100' : type === 'delete' ? 'bg-red-100' : 'bg-gray-100';
	const textColor = type === 'insert' ? 'text-green-800' : type === 'delete' ? 'text-red-800' : 'text-gray-800';

	return (
		<div className={`${bgColor} ${textColor} px-4 py-1 font-mono text-sm whitespace-pre-wrap break-words`}>
			{type === 'insert' && '+ '}
			{type === 'delete' && '- '}
			{content}
		</div>
	);
};

const DiffFile = ({hunks}) => {
	if (!hunks || hunks.length === 0) {
		return null;
	}

	return (
		<div className="mb-4 border rounded-lg overflow-hidden">
			{hunks.map((hunk, index) => (
				<div key={index} className="border-t border-gray-200 first:border-t-0">
					{hunk.changes && hunk.changes.map((change, changeIndex) => (
						<DiffLine
							key={changeIndex}
							type={change.type}
							content={change.content}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default function Index({project, document, change, changeVotes, userVoteProp}) {
	const router = useRouter();
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) => [
		state.userRoles,
		state.setInvalidPermissionsDialogOpen,
	]);
	const [userVote, setUserVote] = useState(userVoteProp || 0);

	const files = change && change.diff_data ? parseDiff(change.diff_data) : [];
	const voteTimeLeft = change && change.vote_timeout ? change.vote_timeout - Date.now() : 0;

	const userCanVote = () => {
		if (!userRoles || !userRoles.length || !project || !project.pid) {
			setInvalidPermissionsDialogOpen(true);
			return false;
		}
		if (!userRoles.find((role) => role.project === project.pid && role.role && role.role.vote_on_change)) {
			setInvalidPermissionsDialogOpen(true);
			return false;
		}
		return true;
	};

	const ResultsSection = () => (
		<>
			<h2 className="mt-4 text-lg px-5 font-semibold">Results</h2>
			<AwaitResults/>
		</>
	);

	if (!project || !document || !change) {
		return <div>Error: Missing required data</div>;
	}

	return (
		<MainLayout>
			<div className="flex flex-col justify-center pb-6 bg-neutral-100">
				<main className="flex flex-col items-start p-8 w-full bg-white rounded-3xl shadow-md max-md:px-5">
					<div className="flex gap-3 items-center flex-wrap">
						<Button
							variant="outline"
							className="p-2.5 rounded-sm border border-gray-200"
							onClick={() => router.push(`/projects/${router.query.pid}/document/${router.query.documentId}/vote`)}
						>
							<IoArrowBackOutline className="w-4 h-4"/>
						</Button>
						<h1 className="text-3xl font-bold leading-9 text-neutral-950">{document.name}</h1>
					</div>
					<div className="flex mt-2 space-x-2 flex-wrap">
						{voteTimeLeft > 0 ? (
							<>
								<VotePageBadge>Voting Ongoing</VotePageBadge>
								<VoteTimeRemainingBadge change={change}/>
							</>
						) : (
							<VotePageBadge>Closed</VotePageBadge>
						)}
					</div>
					<p className="mt-2 text-sm text-neutral-600 w-full max-w-3xl">{change.description || 'No description available'}</p>
					<section className="mt-7 mb-10 w-full">
						<div className="flex gap-5 flex-col lg:flex-row">
							<article className="w-full lg:w-2/3">
								<div className="max-h-screen overflow-y-auto">
									{files.map((file, index) => (
										<DiffFile key={index} {...file} />
									))}
								</div>
							</article>
							<aside className="w-full lg:w-1/3">
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
		</MainLayout>
	);
}

export const getServerSideProps = async ({req, query}) => {
	const {pid, documentId, id} = query;
	const sessionJWT = req.cookies["x_d_jwt"];

	if (!pid || !documentId || !id || !sessionJWT) {
		return {
			redirect: {
				destination: "/error",
				permanent: false,
			},
		};
	}

	try {
		const [project, document, change, changeVotes, {userProfile, roles}] = await Promise.all([
			getProject(pid, sessionJWT),
			getDocument(documentId, sessionJWT),
			getChange(id, sessionJWT),
			getChangeVotes(id, {"include_voters": true}, sessionJWT),
			getOwnUserProfile(sessionJWT),
		]);

		if (!project || !document || !change) {
			return {
				redirect: {
					destination: `/projects/${pid}/document/${documentId}`,
					permanent: false,
				},
			};
		}

		const userVote = changeVotes && changeVotes.voters
			? changeVotes.voters.find((vote) => vote.voter_id === userProfile.uid)
			: null;

		const zustandServerStore = initializeStore({
			userProfile: userProfile || null,
			userRoles: roles || [],
			currentProject: pid,
		});

		const props = {
			project,
			document,
			change,
			changeVotes: changeVotes || {},
			userVoteProp: userVote ? userVote.vote : 0,
			initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
		}
		console.log(props)
		return {
			props
		};
	} catch (error) {
		console.error("Error fetching data:", error);
		return {
			redirect: {
				destination: "/error",
				permanent: false,
			},
		};
	}
};
