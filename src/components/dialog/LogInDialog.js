import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import Login from "@/components/simple/Login";


export function LogInDialog({children}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex items-center justify-center">
        <Login/>
      </DialogContent>
    </Dialog>
  );
}
