import {NavigationMenu, NavigationMenuItem, NavigationMenuList,} from '@/components/ui/navigation-menu'
import React from 'react'
import Image from 'next/image'
import {useRouter} from "next/router";

import {Button} from "@/components/ui/button";
import {DynamicWidget} from "@dynamic-labs/sdk-react-core";
import {useStore} from "@/lib/store";

export default function NavBar() {
	const router = useRouter();
	const [userRoles, currentProject] = useStore((state) => [state.userRoles, state.currentProject]);

	return (
		<div
			className="py-8 border-b border-gray-200 mx-auto max-w-full px-4 sm:px-8 lg:px-16 flex justify-between items-center">
			{/*Left Menu Side*/}
			<div>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem className={"flex hover:cursor-pointer"} onClick={() => router.push('/')}>
							<Image
								src="/living-ip.png"
								className="hidden sm:mr-4 sm:flex"
								width={40}
								height={40}
								alt="LivingIP"
							/>
							<div className="text-2xl font-bold">LivingIP</div>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			{/*Right Menu Side*/}
			{router.pathname !== '/onboard' && (
				<div className="space-x-4">
					<NavigationMenu>
						{userRoles.find((role) => role.project === currentProject && role.role.access_admin_panel) && (
							<NavigationMenuList>
								<NavigationMenuItem>
									<Button
										variant="outline"
										className="p-6 rounded-xl mx-4"
										onClick={() => router.push(`/projects/${currentProject}/management`)}
									>
										Management
									</Button>
								</NavigationMenuItem>
							</NavigationMenuList>
						)}
						<NavigationMenuList>
							<NavigationMenuItem>
								<Button variant="outline" className="p-6 rounded-xl mx-4"
								        onClick={() => router.push('/projects/pid-76047bbe1fc241959bb636eaa4d6e27f/document/did-1569a552a4894b90af40f7a3d511abf4')}>
									User Guide
								</Button>
							</NavigationMenuItem>
						</NavigationMenuList>
						<NavigationMenuList>
							<NavigationMenuItem>
								<DynamicWidget innerButtonComponent={<Button>Connect Wallet</Button>}/>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			)}
		</div>
	);
}
