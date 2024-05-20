import {IoInformationCircleOutline} from "react-icons/io5";

export function VotingNotEndedCard() {
	return (
		<div className="flex flex-col px-12 py-10 mt-4 leading-5 text-center text-neutral-600 max-md:px-5">
			<IoInformationCircleOutline
				className="w-12 h-12 p-2 items-center justify-center shadow-md rounded-lg stroke-white bg-[#245D00] border-2 border-[#D7E2D0]"/>
			<p className="mt-2.5">Results become visible after casting period has ended.</p>
		</div>
	)
}