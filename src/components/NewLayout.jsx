import React, {useEffect, useState} from 'react'
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
import {ProfileHeader} from "@/components/custom/ProfileHeader";

export function NewLayout({children, childClassName, ...props}) {
	const [navbarHeight, setNavbarHeight] = useState(0);
	const [invalidPermissionsDialogOpen, setInvalidPermissionsDialogOpen] = useStore((state) =>
		[state.invalidPermissionsDialogOpen, state.setInvalidPermissionsDialogOpen]
	);

	const handleDialogClose = () => {
		setInvalidPermissionsDialogOpen(false);
	}

	useEffect(() => {
		const navbar = document.getElementById('navbar');
		if (navbar) {
			setNavbarHeight(navbar.offsetHeight);
		}
	}, []);

	return (
		<div className="flex flex-col pb-6 bg-neutral-100 h-screen px-8 overflow-y-auto">
			<ProfileHeader/>
			{children}
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
