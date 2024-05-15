import Image from "next/image";
import * as React from "react";
import {useRouter} from "next/router";
import {NavigationMenu, NavigationMenuItem, NavigationMenuList} from "@/components/ui/navigation-menu";
import {Button} from "@/components/ui/button";
import {DynamicWidget} from "@dynamic-labs/sdk-react-core";
import {useStore} from "@/lib/store";

export function NewNavBar() {
	const router = useRouter();
	const [userRoles, currentProject] = useStore((state) => [state.userRoles, state.currentProject]);

	return (
		<div className="flex gap-5 justify-between py-3 w-full max-md:flex-wrap max-md:px-5 max-md:max-w-full">
			<Image
				loading="lazy"
				src="/Logo-Design-Full-Color-Black.svg"
				alt="Company Logo"
				className="shrink-0 my-auto max-w-full aspect-[4.55] w-[110px] hover:cursor-pointer"
				width={110}
				height={24}
				onClick={() => router.push('/')}
			/>
			<div className="flex gap-1.5 px-2 py-1 rounded">
				{/*TODO: Uncomment once user information is accessible in the Navbar*/}
				{/*<Image loading="lazy" src="/profile/Profile_Picture.svg" alt="Profile Picture"*/}
				{/*       className="shrink-0 my-auto w-8 rounded-full aspect-square" width={32} height={32}/>*/}
				{/*<div className="flex flex-col">*/}
				{/*  <div className="text-sm leading-5 text-neutral-950"> Martin Park</div>*/}
				{/*  <div className="text-xs leading-4 text-zinc-500">0xj7...k68</div>*/}
				{/*</div>*/}
			</div>
			{router.pathname !== '/onboard' && (
				<NavigationMenu>
					<NavigationMenuList className="space-x-4">
						{userRoles.find((role) => role.project === currentProject && role.role.access_admin_panel) && (
							<NavigationMenuItem>
								<Button
									className="p-6 rounded-xl"
									onClick={() => router.push(`/projects/${currentProject}/management`)}
								>
									Management
								</Button>
							</NavigationMenuItem>
						)}
						<NavigationMenuItem>
							<Button
								className="p-6 rounded-xl"
								onClick={() => router.push('/projects/pid-76047bbe1fc241959bb636eaa4d6e27f/document/did-1569a552a4894b90af40f7a3d511abf4')}
							>
								User Guide
							</Button>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<DynamicWidget innerButtonComponent={<Button>Connect Wallet</Button>}/>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			)}
		</div>);
}
