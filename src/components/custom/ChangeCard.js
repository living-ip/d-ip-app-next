import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ChangeResultBadge} from "@/components/custom/ChangeResultBadge";
import {useStore} from "@/lib/store";

export function ChangeCard({change, onClick}) {
	const [userProfile] = useStore((state) => [state.userProfile]);

	const UserItem = ({src, text}) => (
		<div className="flex items-center gap-3 py-2 mt-1 text-sm font-medium leading-5 text-neutral-950">
			<Avatar className="w-8 h-8">
				<AvatarImage src={src} alt={text}/>
				<AvatarFallback>{text.charAt(0).toUpperCase()}</AvatarFallback>
			</Avatar>
			<span>{text}</span>
		</div>
	);

	return (
		<div className="w-full md:w-1/3 py-4 md:py-8" onClick={onClick}>
			<Card
				className="flex flex-col grow justify-center p-4 md:p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
				<h2 className="text-lg font-medium text-neutral-950">{change.name}</h2>
				<p className="mt-1 text-sm text-neutral-600">{change.description}</p>
				<div className="flex flex-row gap-2.5 justify-between items-center mt-3">
					{!change.closed && !change.merged ? (
						<>
							<div className="flex flex-col text-sm">
								<div className="mt-1 font-medium text-neutral-950">{change.votes.count} votes</div>
							</div>
							<div>
								{change.creator_id === userProfile.uid && (
									<UserItem src={change.creator.image_uri} text="Your Change"/>
								)}
							</div>
						</>
					) : (
						<div className="flex flex-row w-full justify-between items-center">
							<UserItem src={change.creator.image_uri} text={change.creator.name}/>
							<ChangeResultBadge change={change}/>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}