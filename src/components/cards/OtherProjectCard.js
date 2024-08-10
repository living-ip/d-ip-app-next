import Image from 'next/image';
import RequestAccessDialog from "@/components/dialog/RequestAccessDialog";

export function OtherProjectCard({project}) {
	return (
		<div
			className="flex flex-col md:flex-row gap-3 mt-3 bg-white rounded-xl border border-gray-200 border-solid overflow-hidden">
			<div className="w-full md:w-[276px] h-[138px] relative flex-shrink-0">
				<Image
						className="object-cover object-center"
						src={project.image_uri}
						alt={project.name}
						fill
						sizes="(max-width: 768px) 100vw, 276px"
					/>
			</div>
			<RequestAccessDialog project={project}>
				<div className="flex flex-col p-3 flex-1 text-sm font-medium overflow-hidden">
					<h3 className="text-lg text-neutral-950 truncate">{project.name}</h3>
					<p className="mt-1 text-neutral-600 line-clamp-3">{project.description}</p>
				</div>
			</RequestAccessDialog>
		</div>
	);
}