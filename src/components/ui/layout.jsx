import React, {useEffect, useState} from 'react'
import NavBar from "@/components/NavBar";
import {Footer} from "@/components/ui/footer";
import {cn} from "@/lib/utils";
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

export function Layout({children, childClassName, ...props}) {
	const [navbarHeight, setNavbarHeight] = useState(0);
	const [footerHeight, setFooterHeight] = useState(0);
	const [invalidPermissionsDialogOpen, setInvalidPermissionsDialogOpen] = useStore((state) =>
			[state.invalidPermissionsDialogOpen, state.setInvalidPermissionsDialogOpen]
	);

	const handleDialogClose = () => {
		setInvalidPermissionsDialogOpen(false);
	}

	useEffect(() => {
		const navbar = document.getElementById('navbar');
		const footer = document.getElementById('footer');
		if (navbar && footer) {
			setNavbarHeight(navbar.offsetHeight);
			setFooterHeight(footer.offsetHeight);
		}
	}, []);

	return (
		<div {...props}>
			<div id="navbar" className="fixed top-0 w-full z-10 bg-white">
				<NavBar/>
			</div>
			<div className={cn('mx-auto max-w-full px-3 sm:px-16 lg:px-32 pt-24', childClassName)}
			     style={{minHeight: `calc(100vh - ${navbarHeight}px - ${footerHeight}px + 108px)`}}>
				{children}
			</div>
			<div id="footer" className={"mx-auto max-w-full px-8 sm:px-16 lg:px-32 border-t border-gray-200"}>
				<Footer/>
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
