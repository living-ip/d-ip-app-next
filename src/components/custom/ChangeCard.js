import {Card} from "@/components/ui/card";
import Image from "next/image";
import {ChangeResultBadge} from "@/components/custom/ChangeResultBadge";
import {useStore} from "@/lib/store";

export function ChangeCard({change, onClick}) {
	const [userProfile] = useStore((state) => [state.userProfile]);
	console.log("User Profile: ", userProfile);

	const UserItem = ({src, text}) => (
		<div className="flex gap-3 py-2 mt-1 text-sm font-medium leading-5 text-neutral-950">
			{src && (
				<Image src={src} alt={`${text}`} height={32} width={32} className="shrink-0 w-8 aspect-square rounded-full"/>
			)}
			<div className="my-auto">{text}</div>
		</div>
	);

	return (
		<div className="md:w-1/3 w-full py-8 cursor-pointer" onClick={onClick}>
			<Card
				className="flex flex-col grow justify-center px-5 py-4 mx-auto w-full bg-white rounded-xl border border-gray-200 border-solid max-md:mt-3">
				<h2 className="text-lg font-medium text-neutral-950">{change.name}</h2>
				<p className="mt-1 text-sm text-neutral-600">{change.description}</p>
				<div className="flex flex-row gap-2.5 justify-between items-center mt-3">
					{(!change.closed && !change.merged) ? (
						<>
							<div className="flex flex-col text-sm">
								<div className="mt-1 font-medium text-neutral-950">{change.votes.count} votes</div>
							</div>
							<div>
								{change.creator_id === userProfile.uid ? (
									<UserItem src={change.creator.image_uri} text="Your Change"/>
								) : null}
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