import {VotingNotEndedCard} from "@/components/custom/VotingNotEndedCard";
import {ResultsCard} from "@/components/custom/ResultsCard";
import {VotingForm} from "@/components/custom/VotingForm";
import {useState} from "react";
import {useStore} from "@/lib/store";

export function VoteResultsSection({project, change, changeVotes, userVoteProp}) {
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) =>
		[state.userRoles, state.setInvalidPermissionsDialogOpen]
	);
	const [userVote, setUserVote] = useState(userVoteProp);

	const userCanVote = () => {
		if (!userRoles.find((role) => role.project === project.pid && role.role.vote_on_change)) {
			setInvalidPermissionsDialogOpen(true);
			return false;
		}
		return true;
	}

	return (
		<>
			{(change.closed || change.merged) ? (
				<ResultsCard change={change} changeVotes={changeVotes}/>
			) : (
				userCanVote() ? (
					<>
						<VotingForm change={change} userVote={userVote} setUserVote={setUserVote}/>
						<VotingNotEndedCard/>
					</>
				) : (
					<>
						<VotingNotEndedCard/>
					</>
				)
			)}
		</>
	);
}