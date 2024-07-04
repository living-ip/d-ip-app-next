import Image from 'next/image';

export function OtherProjectCard({project}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mt-3 bg-white rounded-xl border border-gray-200 border-solid overflow-hidden">
      <div className="w-full md:w-[276px] h-[138px] relative">
        <Image
          className="object-cover object-center"
          src={project.image_uri}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, 276px"
        />
      </div>
      <div className="flex flex-col p-3 flex-1 text-sm font-medium">
        <h3 className="text-lg text-neutral-950">{project.name}</h3>
        <p className="mt-1 text-neutral-600">{project.description}</p>
        {/*TODO: Ben - Uncomment once API returns relevant values*/}
        {/*<div className="flex gap-1 self-start py-3 mt-1 text-xs text-lime-950">
          <div className="px-2 py-0.5 bg-neutral-300 rounded-full">{project.members} members</div>
          <div className="px-2 py-0.5 bg-neutral-300 rounded-full">{project.articles} articles</div>
        </div>*/}
        {/*<div className="mt-1 leading-[143%] text-zinc-500">Last edit {project.lastEdit}</div>*/}
      </div>
    </div>
  );
}