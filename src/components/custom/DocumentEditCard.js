import {PiTrashSimple} from "react-icons/pi";
import {FiEdit3} from "react-icons/fi";
import {NotPublishedBadge} from "@/components/custom/NotPublishedBadge";
import {PublishedBadge} from "@/components/custom/PublishedBadge";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";

export function DocumentEditCard({project, document, change}) {
	const router = useRouter();

	console.log(change);

	return (
		<div
			className="flex gap-3 justify-between items-center px-5 py-4 mt-3 bg-white rounded-xl border border-gray-200 border-solid max-md:flex-wrap">
			<div className="flex gap-3 max-md:flex-wrap">
				<div className="flex flex-col max-md:max-w-full">
					<div className="text-lg font-medium text-neutral-950 max-md:max-w-full">
						{change.name}
					</div>
					<div className="mt-2 text-sm text-zinc-500 max-md:max-w-full">
						{new Date(change.created_at).toLocaleString()}
					</div>
				</div>
			</div>
			<div className="flex flex-row space-x-4 items-center">
				{change.published && (
					<PublishedBadge/>
				)}
				{!change.published && (
					<>
						<NotPublishedBadge/>
						<Button variant="ghost">
							<PiTrashSimple className="w-4 h-4 shrink-0 self-stretch my-auto aspect-square"
							               //TODO: Implement delete functionality
							               onClick={() => {console.log("Delete")}}
							/>
						</Button>
						<div className="flex gap-3 self-stretch my-auto text-base font-medium leading-6 whitespace-nowrap">
							<Button variant="ghost" onClick={() => {router.push(`/projects/${encodeURI(project.pid)}/document/${encodeURIComponent(document.did)}/edit/${change.cid}`)}}
								className="flex gap-1 justify-between px-3 py-2 rounded border border-gray-200 border-solid text-neutral-600">
								<FiEdit3 className="w-4 h-4 shrink-0 my-auto aspect-square"/>
								<div>Edit</div>
							</Button>
							<div className="justify-center px-3 py-2 rounded bg-[#E8ECE6]">
								Publish
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}