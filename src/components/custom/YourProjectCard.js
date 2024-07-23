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
      className="flex flex-col w-full cursor-pointer"
    >
      <div className="flex flex-col w-full rounded-xl border border-gray-200 border-solid overflow-hidden">
        <div className="w-full h-48 relative">
          <Image
            className="object-cover object-center"
            src={project.image_uri}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex flex-col p-4">
          <h3 className="mb-2 text-lg font-medium leading-7 text-neutral-950">
            {project.name}
          </h3>
          <p className="text-sm leading-5 text-neutral-600 overflow-x-clip">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}