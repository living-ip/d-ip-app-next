import Image from "next/image";
import {Progress} from "@/components/ui/progress";
import {ResultsBadge} from "@/components/badge/ResultsBadge";

export function ResultsCard({change, changeVotes}) {

	const positiveVotes = changeVotes.positive_voters;
	const negativeVotes = changeVotes.negative_voters;

	const ResultItem = ({status, count, percentage, colorClass}) => (
		<div className="flex gap-1 justify-between mt-3 w-full text-xs leading-4 whitespace-nowrap">
			<div className="flex gap-2 text-neutral-600">
				<div className={`shrink-0 w-1 h-4 rounded ${colorClass}`}/>
				<div>{status}</div>
			</div>
			<div className="flex gap-1">
				<div className="font-medium text-neutral-950">{count}</div>
				<div className="text-zinc-500">({percentage}%)</div>
			</div>
		</div>
	);

	const VoterItem = ({name, src}) => (
		<div className="flex gap-3 py-2 mt-1 text-sm font-medium leading-5 text-neutral-950">
			{src && (
				<Image src={src} alt={`${name}`} height={32} width={32} className="shrink-0 w-8 aspect-square"/>
			)}
			<div className="my-auto">{name}</div>
		</div>
	);

	return (
		<section className="flex flex-col px-5 max-md:mt-6">
			<header className="flex gap-2.5 justify-between whitespace-nowrap">
				<div className="text-lg text-neutral-950">Results</div>
				<ResultsBadge change={change}/>
			</header>
			<div className="flex gap-1 mt-3">
				<Progress
					className={"bg-[#DC2626]"}
					value={(positiveVotes.length / (positiveVotes.length + negativeVotes.length)) * 100}
					max={100}
				/>
			</div>
			<ResultItem status="Approve" count={positiveVotes.length}
			            percentage={(positiveVotes.length / (positiveVotes.length + negativeVotes.length)) * 100}
			            colorClass="bg-[#7C9E66]"/>
			<ResultItem status="Reject" count={negativeVotes.length}
			            percentage={(negativeVotes.length / (positiveVotes.length + negativeVotes.length)) * 100}
			            colorClass="bg-[#DC2626]"/>
			<div className="mt-8 text-lg leading-7 text-neutral-950">Voters</div>
			<div className="mt-3 text-base font-medium leading-6 text-neutral-600">Approved</div>
			{positiveVotes.map((voter, index) => (
				<VoterItem key={index} name={voter.name} src={voter.image_uri}/>
			))}
			<div className="mt-2 text-base font-medium leading-6 text-neutral-600">Rejected</div>
			{negativeVotes.map((voter, index) => (
				<VoterItem key={index} name={voter.name} src={voter.image_uri}/>
			))}
		</section>
	)
}