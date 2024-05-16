import Image from "next/image";
import {PassedBadge} from "@/components/custom/PassedBadge";
import {NotPassedBadge} from "@/components/custom/NotPassedBadge";

export function ResultsCard({change}) {
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
			<Image src={src} alt={`${name}`} height={32} width={32} className="shrink-0 w-8 aspect-square"/>
			<div className="my-auto">{name}</div>
		</div>
	);

	return (
		<section className="flex flex-col px-5 max-md:mt-6">
			<header className="flex gap-2.5 justify-between whitespace-nowrap">
				<div className="text-lg leading-7 text-neutral-950">Results</div>
				{change.closed ? (
					<NotPassedBadge />
				) : (
					<PassedBadge />
				)}
			</header>
			<div className="flex gap-1 mt-3">
				<div className="flex-1 shrink-0 h-1.5 rounded bg-[#7C9E66]"/>
				<div className="shrink-0 w-10 h-1.5 bg-red-600 rounded"/>
			</div>
			<ResultItem status="Approve" count="12" percentage="75" colorClass="bg-stone-500"/>
			<ResultItem status="Reject" count="4" percentage="25" colorClass="bg-red-600"/>
			<div className="mt-8 text-lg leading-7 text-neutral-950">Voters</div>
			<div className="mt-3 text-base font-medium leading-6 text-neutral-600">Approved</div>
			<VoterItem name="Martin Park"
			           src="/living-ip.png"
			/>
			<div className="mt-2 text-base font-medium leading-6 text-neutral-600">Rejected</div>
			<VoterItem name="Martin Park"
			           src="/favicon.ico"/>
		</section>
	)
}