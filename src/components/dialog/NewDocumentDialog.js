import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {NewDocumentCard} from "@/components/cards/NewDocumentCard";


export function NewDocumentDialog({children, project}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <NewDocumentCard project={project}/>
      </DialogContent>
    </Dialog>
  );
}