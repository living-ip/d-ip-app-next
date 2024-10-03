import { useRouter } from "next/router";
import { useStore } from "@/lib/store";
import Image from "next/image";

export function YourProjectCard({ project }) {
  const router = useRouter();
  const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) => [
    state.userRoles,
    state.setInvalidPermissionsDialogOpen,
  ]);

  const goToProject = () => {
    if (!userRoles.find((role) => role.project === project.pid)) {
      setInvalidPermissionsDialogOpen(true);
      return;
    }
    router.push(`/projects/${encodeURIComponent(project.pid)}`);
  };

  return (
    <div
      onClick={goToProject}
      className="flex flex-col w-full h-[300px] cursor-pointer"
    >
      <div className="flex flex-col w-full h-full rounded-xl border border-gray-200 border-solid overflow-hidden">
        <div className="w-full h-[200px] relative">
          <Image
            className="object-cover object-center"
            src={project.image_uri}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex flex-col p-3 h-[100px]">
          <h3 className="mb-1 text-base font-medium leading-6 text-neutral-950 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-xs leading-4 text-neutral-600 line-clamp-3">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
