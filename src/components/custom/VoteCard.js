import {Card} from "@/components/ui/card";
import Image from "next/image";
import {RejectedBadge} from "@/components/custom/RejectedBadge";
import {PassedBadge} from "@/components/custom/PassedBadge";

export function VoteCard({change, changeVotes, user}) {

	const UserItem = ({src, text}) => (
		<div className="flex gap-3 py-2 mt-1 text-sm font-medium leading-5 text-neutral-950">
			<Image src={src} alt={`${text}`} height={32} width={32} className="shrink-0 w-8 aspect-square"/>
			<div className="my-auto">{text}</div>
		</div>
	);

	return (
		<div className="md:w-1/3 w-full">
			<Card
				className="flex flex-col grow justify-center px-5 py-4 mx-auto w-full bg-white rounded-xl border border-gray-200 border-solid max-md:mt-3">
				<h2 className="text-lg font-medium text-neutral-950">{change.name}</h2>
				<p className="mt-1 text-sm text-neutral-600">{change.description}</p>
				<div className="flex flex-row gap-2.5 justify-between items-center mt-3">
					{(!change.closed && !change.merged) ? (
						<>
							<div className="flex flex-col text-sm">
								{/*TODO: Uncomment once changeVotes for change is passed to card*/}
								{/*<span className="mt-1 font-medium text-neutral-950">{changeVotes.length} votes</span>*/}
								<span className="mt-1 font-medium text-neutral-950">XXX votes</span>
							</div>
							{/*TODO: Uncomment once user is passed to card*/}
							{/*<div>*/}
							{/*	{change.creator_id === user.id ? (*/}
							{/*		<UserItem src={user.avatar} text="Your Change"/>*/}
							{/*	) : null}*/}
							{/*</div>*/}
						</>
					) : (change.closed ? (
						<div className="flex flex-row w-full justify-between items-center">
							{/*TODO: Fix src*/}
							<UserItem src={change.creator_avatar} text={change.creator_name}/>
							<RejectedBadge/>
						</div>
					) : (
						<div className="flex flex-row w-full justify-between items-center">
							{/*TODO: Fix src*/}
							<UserItem src={change.creator_avatar} text={change.creator_name}/>
							<PassedBadge/>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}