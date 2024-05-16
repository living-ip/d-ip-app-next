import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {useState} from "react";
import {authStytchRequest} from "@/lib/stytch";
import {Diff, Hunk, parseDiff} from "react-diff-view";
import "react-diff-view/style/index.css";
import {getChange, getChangeVotes, voteOnChange} from "@/lib/change";
import {Layout} from "@/components/ui/layout";
import {getProject} from "@/lib/project";
import {getDocument} from "@/lib/document";
import {getCookie} from "cookies-next";
import {getUserRoles} from "@/lib/user";
import {initializeStore, useStore} from "@/lib/store";
import {VotingForm} from "@/components/custom/VotingForm";
import Image from "next/image";
import {NewLayout} from "@/components/NewLayout";
import {VotingOngoingBadge} from "@/components/custom/VotingOngoingBadge";

function Results() {
	return (
		<div className="flex flex-col px-12 py-10 mt-4 leading-5 text-center text-neutral-600 max-md:px-5">
			<Image
				src="/living-ip.png"
				alt="" className="self-center w-8 shadow-md aspect-square"
				width="64" height="64"
			/>
			<p className="mt-2.5">Results become visible after casting period has ended.</p>
		</div>
	);
}

export default function Index({project, document, change, changeVotes, userVoteProp}) {
	const router = useRouter();
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) =>
		[state.userRoles, state.setInvalidPermissionsDialogOpen]
	);
	const [totalVotes, setTotalVotes] = useState(changeVotes.count || 0);
	const [userVote, setUserVote] = useState(userVoteProp);

	const goToVotes = () => {
		router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote`);
	};

	const goToDocument = () => {
		router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}`);
	}

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

	const userCanVote = () => {
		if (!userRoles.find((role) => role.project === project.pid && role.role.vote_on_change)) {
			setInvalidPermissionsDialogOpen(true);
			return false;
		}
		return true;
	}

	const incrementVote = async () => {
		if (!userCanVote()) {
			return;
		}
		const result = await voteOnChange(change.cid, {vote: 1}, getCookie("stytch_session_jwt"));
		if (!result) {
			return;
		}
		if (userVote === 0) {
			setTotalVotes(totalVotes + 1);
		}
		setUserVote(1);
	};

	const decrementVote = async () => {
		if (!userCanVote()) {
			return;
		}
		const result = await voteOnChange(change.cid, {vote: -1}, getCookie("stytch_session_jwt"));
		if (!result) {
			return;
		}
		if (userVote === 0) {
			setTotalVotes(totalVotes + 1);
		}
		setUserVote(-1);
	};

	return (
		<NewLayout>
			<div className="flex flex-col justify-center pb-6 bg-neutral-100">
				<main
					className="flex flex-col items-start p-8 w-full bg-white rounded-3xl max-md:px-5 max-md:max-w-full">
					<VotingOngoingBadge/>
					<h1 className="mt-7 text-3xl text-neutral-950 max-md:max-w-full">{change.name}</h1>
					<p className="mt-2 text-sm text-neutral-600 w-[722px] max-md:max-w-full">{change.description}</p>
					<section className="mt-7 mb-40 max-md:mb-10 max-md:max-w-full">
						<div className="flex gap-5 max-md:flex-col max-md:gap-0">
							<article className="flex flex-col w-[69%] max-md:ml-0 max-md:w-full">
								<div
									className="flex flex-col p-8 w-full text-base rounded-2xl bg-zinc-50 text-neutral-600 max-md:px-5 max-md:mt-6 max-md:max-w-full">
									{files.map(renderFile)}
								</div>
							</article>
							<aside className="flex flex-col ml-5 w-[31%] max-md:ml-0 max-md:w-full">
								<VotingForm/>
								<h2 className="mt-4 text-lg">Results</h2>
								<Results/>
							</aside>
						</div>
					</section>
				</main>
			</div>

				{/*<Button variant={userVote === -1 ? "" : "outline"} onClick={decrementVote}>*/}
				{/*	-1*/}
				{/*</Button>*/}
				{/*<Button variant={userVote === 1 ? "" : "outline"} className="mx-8" onClick={incrementVote}>*/}
				{/*	+1*/}
				{/*</Button>*/}

				{/*<div className="text-xl">Total Votes: {totalVotes}</div>*/}

				<div className="flex-1 max-w-full max-h-screen p-4 ml-2 border-l mt-14 lg:prose-md">
					<div className="h-full px-5 -mt-6 overflow-x-scroll overflow-y-scroll">
						{files.map(renderFile)}
					</div>
				</div>

		</NewLayout>
	)

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
	console.log("Pid: ", pid);
	console.log("Document ID: ", documentId);
	console.log("Change ID: ", id);

	const sessionJWT = req.cookies["stytch_session_jwt"];

	const project = await getProject(pid, sessionJWT);
	console.log("Project: ", project);
	const document = await getDocument(documentId, sessionJWT);
	console.log("Document: ", document);
	const change = await getChange(id, sessionJWT);
	console.log("Change: ", change);
	if (!project || !document || !change) {
		return {
			redirect: {
				destination: `/projects/${pid}/document/${documentId}`,
				permanent: false,
			},
		};
	}
	const changeVotes = await getChangeVotes(id, {"include_voters": true}, sessionJWT);
	console.log("Change Votes: ", changeVotes);
	const userVote = changeVotes.voters.find((vote) => vote.voter_id === session.user_id);
	console.log("User Vote: ", userVote);

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
			change: change,
			changeVotes: changeVotes || 0,
			userVoteProp: userVote ? userVote.vote : 0,
			initialZustandState: JSON.parse(
				JSON.stringify(zustandServerStore.getState())
			),
		},
	};
};
