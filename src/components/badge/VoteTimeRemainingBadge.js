import {VotePageBadge} from "@/components/badge/VotePageBadge";

export default function VoteTimeRemainingBadge({change}){

	const voteTimeLeft = change.vote_timeout - Date.now();

	const getTimeBadge = (remainingTime) => {
		const minutes = Math.floor(remainingTime / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (remainingTime <= 0) return "Expired";
		if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''}`;
		if (hours < 24) return `${hours} hr${hours !== 1 ? 's' : ''}`;
		return `${days} day${days !== 1 ? 's' : ''}`;
	};

	if (voteTimeLeft > 0) {
		return (
			<VotePageBadge>{getTimeBadge(voteTimeLeft)}</VotePageBadge>
		)
	} else {
		return (
			<VotePageBadge>Voting Closed</VotePageBadge>
		)
	}

}