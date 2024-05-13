import Image from 'next/image';

export function OtherProjectCard({project}) {
  return (
    <div
      className="flex gap-3 py-3 px-3 mt-3 bg-white rounded-xl border border-gray-200 border-solid max-md:flex-wrap">
      <div
        className="w-full h-auto max-w-[276px] rounded-xl my-auto max-md:px-5">
        <Image
          className="rounded-xl"
          src={project.image_uri}
          alt={project.name}
          width={320}
          height={138}
          layout="contain"
        />
      </div>
      <div className="flex flex-col flex-1 text-sm font-medium max-md:max-w-full">
        <div className="text-lg leading-7 text-neutral-950 max-md:max-w-full">{project.name}</div>
        <div className="mt-1 leading-5 text-neutral-600 max-md:max-w-full">{project.description}</div>
        <div className="flex gap-1 self-start py-3 mt-1 text-xs leading-4 text-lime-950">
          <div className="justify-center px-2 py-0.5 bg-neutral-300 rounded-[100px]">{project.members} members</div>
          <div className="justify-center px-2 py-0.5 bg-neutral-300 rounded-[100px]">{project.articles} articles</div>
        </div>
        <div className="mt-1 leading-[143%] text-zinc-500 max-md:max-w-full">Last edit {project.lastEdit}</div>
      </div>
    </div>
  );
}