import {useRouter} from "next/router";
import {useStore} from "@/lib/store";
import Image from "next/image";

export function YourProjectCard({project}) {
  const router = useRouter();
  const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) =>
    [state.userRoles, state.setInvalidPermissionsDialogOpen]
  );

  const goToProject = () => {
    if (!userRoles.find((role) => role.project === project.pid)) {
      setInvalidPermissionsDialogOpen(true);
      return;
    }
    router.push(`/projects/${encodeURIComponent(project.pid)}`)
  };

  return (
    <div onClick={goToProject} className="flex flex-col max-md:ml-0 max-md:w-full cursor-pointer">
      <div className="flex flex-col grow w-full rounded-xl border border-gray-200 border-solid max-md:mt-4 max-md:max-w-full">
        <div className="flex flex-col justify-center items-end rounded-xl max-md:max-w-full">
          <div className="p-0 w-full max-h-64 flex gap-0.5 justify-between text-sm font-medium rounded-sm text-neutral-600">
            <Image
              className="rounded-t-lg"
              src={project.image_uri}
              alt={project.name}
              width={128}
              height={64}
              layout="responsive"
            />
          </div>
          <div className="flex flex-col px-2 mt-3 w-full max-md:max-w-full">
            <div className="mb-2 text-lg font-medium leading-7 text-neutral-950 max-md:max-w-full">{project.name}</div>
            <div className="py-2 mt-1 text-sm leading-5 text-neutral-600 max-md:max-w-full">{project.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
