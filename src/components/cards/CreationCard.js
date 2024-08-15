import { useRouter } from "next/router";
import { useStore } from "@/lib/store";
import Image from "next/image";

export function CreationCard({ creation, projectId }) {
  const router = useRouter();
  const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) => [
    state.userRoles,
    state.setInvalidPermissionsDialogOpen,
  ]);

  const goToCreation = () => {
    if (!userRoles.find((role) => role.project === projectId)) {
      setInvalidPermissionsDialogOpen(true);
      return;
    }
    router.push(`/projects/${encodeURIComponent(projectId)}/document/${creation.did}`);
  };

  return (
    <div
      onClick={goToCreation}
      className="flex flex-col w-full h-[360px] cursor-pointer"
    >
      <div className="flex flex-col w-full h-full rounded-xl border border-gray-200 border-solid overflow-hidden">
        <div className="w-full h-48 relative">
          <Image
            className="object-cover object-center"
            src={creation.image_uri || "/default-creation-image.jpg"}
            alt={creation.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex flex-col p-4 h-[168px]">
          <h3 className="mb-2 text-lg font-medium leading-7 text-neutral-950 line-clamp-1">
            {creation.name}
          </h3>
          <p className="text-sm leading-5 text-neutral-600 line-clamp-4">
            {creation.description}
          </p>
        </div>
      </div>
    </div>
  );
}
