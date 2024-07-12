import React from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useStore} from "@/lib/store";
import {NewNavBar} from "@/components/custom/NewNavBar";

export function NewLayout({children}) {
	const [invalidPermissionsDialogOpen, setInvalidPermissionsDialogOpen] = useStore((state) => [
		state.invalidPermissionsDialogOpen,
		state.setInvalidPermissionsDialogOpen
	]);
	const handleDialogClose = () => {
		setInvalidPermissionsDialogOpen(false);
	}
	return (
		<div className="flex flex-col min-h-screen bg-neutral-100">
			<NewNavBar/>
			<main className="flex-grow px-4 md:px-8 py-6 overflow-y-auto">
				{children}
			</main>
			<AlertDialog open={invalidPermissionsDialogOpen} onOpenChange={handleDialogClose}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Invalid Permissions
						</AlertDialogTitle>
						<AlertDialogDescription>
							You do not have permissions to perform this action.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={handleDialogClose}>
							OK
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}