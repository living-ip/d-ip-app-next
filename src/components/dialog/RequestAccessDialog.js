/**
 * v0 by Vercel.
 * @see https://v0.dev/t/rNYchEp5ea2
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {useToast} from "@/components/ui/use-toast";
import {useState} from "react";

export default function RequestAccessDialog({children, project}) {

	const {toast} = useToast();
	const [open, setOpen] = useState(false);

	const handleRequestAccess = (e) => {
		e.preventDefault();
		// TODO impl handler
		toast({
			title: "Access requested",
			description: "An admin has been notified and will review your request soon.",
		})
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[450px]">
				<DialogHeader>
					<DialogTitle>Request Access to {project.name}</DialogTitle>
					<DialogDescription>
						You can request access to this project. An admin will review your request soon.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Button onClick={handleRequestAccess} className="w-full">
						Request Access
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}