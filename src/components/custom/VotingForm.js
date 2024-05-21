import {Button} from "@/components/ui/button";
import {IoCheckmark, IoClose} from "react-icons/io5";
import {voteOnChange} from "@/lib/change";
import {getCookie} from "cookies-next";
import {useState} from "react";

export function VotingForm({change, userVote, setUserVote}) {
	const [changeVotes, setChangeVotes] = useState(userVote !== (1 || -1));

	return (
		<div className="flex flex-col justify-center px-5 py-4 font-medium rounded-2xl">
			<div className="flex justify-between items-center">
				<p className="text-lg">Cast your vote</p>
				{((userVote === 1) || (userVote === -1)) && !changeVotes ? (<Button variant="ghost" className="text-sm" onClick={() => setChangeVotes(true)}>Change vote</Button>) : null}
			</div>
			{!changeVotes ? (
				<div className="flex justify-center items-center p-4">
					<p className="text-sm text-neutral-600">You have voted</p>
				</div>
			) : (
				<>
					{userVote === -1 ? (
						<Button variant="outline"
						        className="justify-between items-center mt-4 border-red-500 bg-white text-red-500 hover:border-red-500 hover:bg-white hover:text-red-500">
							Reject
							<IoClose/>
						</Button>
					) : (
						<Button variant="outline" onClick={() => setUserVote(-1)}
						        className="justify-between items-center mt-4 hover:border-red-500 hover:bg-white hover:text-red-500">
							Reject
							<IoClose/>
						</Button>
					)}
					{userVote === 1 ? (
						<Button variant="outline"
						        className="justify-between items-center mt-2 border-green-700 bg-white text-green-700 hover:border-green-700 hover:bg-white hover:text-green-700">
							Approve
							<IoCheckmark/>
						</Button>
					) : (
						<Button variant="outline" onClick={() => setUserVote(1)}
						        className="justify-between items-center mt-2 hover:border-green-700 hover:bg-white hover:text-green-700">
							Approve
							<IoCheckmark/>
						</Button>
					)
					}
					<Button type="submit" disabled={userVote === 0}
					        className="justify-center items-center mt-4 disabled:bg-[#E8ECE6] disabled:text-[#B0B0B0]"
					        onClick={() => {
						        console.log("vote submitted: ", userVote)
						        voteOnChange(change.cid, {vote: userVote}, getCookie("stytch_session_jwt")).then(setChangeVotes(false))
					        }}>
						Vote
					</Button>
				</>
			)}
		</div>
	)
}