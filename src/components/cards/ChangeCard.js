import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ChangeResultBadge} from "@/components/badge/ChangeResultBadge";
import {useStore} from "@/lib/store";
import VoteTimeRemainingBadge from "@/components/badge/VoteTimeRemainingBadge";

export function ChangeCard({change, onClick}) {
	const [userProfile] = useStore((state) => [state.userProfile]);

	const parseChangeName = (name) => {
		return name.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const UserItem = ({src, text}) => (
		<div className="flex items-center gap-2 text-sm font-medium leading-5 text-neutral-950">
			<Avatar className="w-6 h-6">
				<AvatarImage src={src} alt={text}/>
				<AvatarFallback>{text.charAt(0).toUpperCase()}</AvatarFallback>
			</Avatar>
			<span className="truncate">{text}</span>
		</div>
	);

	return (
		<Card
			className="max-w-full flex flex-col p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
			onClick={onClick}
		>
			<h2 className="text-lg font-medium text-neutral-950 truncate">{parseChangeName(change.name)}</h2>
			<p className="mt-1 text-sm text-neutral-600 line-clamp-2">{change.description}</p>
			<div className="flex flex-row gap-2 justify-between items-center mt-3">
				{!change.closed && !change.merged ? (
					<>
						<VoteTimeRemainingBadge change={change}/>
						<div className="text-sm font-medium text-neutral-950">{change.votes.count} votes</div>
						{change.creator_id === userProfile.uid && (
							<UserItem src={change.creator.image_uri} text="Your Change"/>
						)}
					</>
				) : (
					<>
						<UserItem src={change.creator.image_uri} text={change.creator.name}/>
						<ChangeResultBadge change={change}/>
					</>
				)}
			</div>
		</Card>
	);
}
