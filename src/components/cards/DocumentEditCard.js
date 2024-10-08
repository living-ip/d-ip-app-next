import {PiTrashSimple} from "react-icons/pi";
import {FiEdit3} from "react-icons/fi";
import {NotPublishedBadge} from "@/components/badge/NotPublishedBadge";
import {PublishedBadge} from "@/components/badge/PublishedBadge";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {getCookie} from "cookies-next";
import {deleteChange, publishChange} from "@/lib/change";
import {getAuthToken} from "@dynamic-labs/sdk-react-core";

export function DocumentEditCard({project, document, change}) {
	const router = useRouter();

	const handleDeleteChange = async (cid, jwt) => {
		await deleteChange(cid, jwt);
		router.reload();
	}

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
							               onClick={() => {
								               handleDeleteChange(change.cid, getAuthToken());
							               }}
							/>
						</Button>
						<div
							className="flex gap-3 self-stretch my-auto text-base font-medium leading-6 whitespace-nowrap">
							<Button variant="ghost" onClick={() => {
								router.push(`/projects/${encodeURI(project.pid)}/document/${encodeURIComponent(document.did)}/edit/${change.cid}`)
							}}
							        className="flex gap-1 justify-between px-3 py-2 rounded border border-gray-200 border-solid text-neutral-600">
								<FiEdit3 className="w-4 h-4 shrink-0 my-auto aspect-square"/>
								<div>Edit</div>
							</Button>
							<Button variant="ghost" className="justify-center px-3 py-2 rounded bg-[#E8ECE6]"
							        onClick={async () => {
								        await publishChange(change.cid, getAuthToken());
								        await router.push(`/projects/${encodeURI(project.pid)}/document/${encodeURIComponent(document.did)}/vote`);
							        }}>
								Publish
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	)
}