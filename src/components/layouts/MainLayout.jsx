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
import {NavBar} from "@/components/custom/NavBar";

export function MainLayout({children}) {
	const [invalidPermissionsDialogOpen, setInvalidPermissionsDialogOpen] = useStore((state) => [
		state.invalidPermissionsDialogOpen,
		state.setInvalidPermissionsDialogOpen
	]);
	const handleDialogClose = () => {
		setInvalidPermissionsDialogOpen(false);
	}
	return (
		<div className="flex flex-col min-h-screen bg-neutral-100">
			<NavBar/>
			<div className="flex-grow overflow-y-auto w-full px-4">
				{children}
			</div>
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
