import { useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/lib/store";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function CreationCard({ creation, projectId }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) => [
    state.userRoles,
    state.setInvalidPermissionsDialogOpen,
  ]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const submitUserCreation = () => {
    if (!userRoles.find((role) => role.project === projectId)) {
      setInvalidPermissionsDialogOpen(true);
      return;
    }
    // TODO: Implement submission logic
    console.log("Submitting user creation");
    closeDialog();
  };

  return (
    <>
      <div
        onClick={openDialog}
        className="flex flex-col w-full cursor-pointer"
      >
        <div className="flex flex-col w-full rounded-xl border border-gray-200 border-solid overflow-hidden">
          <div className="w-full h-48 relative">
            <Image
              className="object-cover object-center"
              src={creation.media_uri || "/default-creation-image.jpg"}
              alt={creation.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="flex flex-col p-4">
            <h3 className="mb-2 text-lg font-medium leading-7 text-neutral-950 line-clamp-1">
              {creation.title}
            </h3>
            <p className="text-sm leading-5 text-neutral-600 line-clamp-3 max-h-[60px] overflow-hidden">
              {creation.description}
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{creation.title}</DialogTitle>
          </DialogHeader>
          <div className="w-full h-64 relative mb-4">
            <Image
              className="object-cover object-center rounded-lg"
              src={creation.media_uri || "/default-creation-image.jpg"}
              alt={creation.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <DialogDescription>
            {creation.description}
          </DialogDescription>
          <div className="mt-4 flex justify-end">
            <Button onClick={submitUserCreation}>Submit Creation</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
