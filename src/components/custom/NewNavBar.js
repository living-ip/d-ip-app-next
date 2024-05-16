import Image from "next/image";
import * as React from "react";
import {useRouter} from "next/router";
import {NavigationMenu, NavigationMenuItem, NavigationMenuList} from "@/components/ui/navigation-menu";
import {Button} from "@/components/ui/button";
import {useStore} from "@/lib/store";
import ConnectWalletButton from "@/components/custom/ConnectWalletButton";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {deleteCookie, setCookie} from "cookies-next";

export function NewNavBar() {
	const router = useRouter();
	const [userRoles, currentProject] = useStore((state) => [state.userRoles, state.currentProject]);
	const userProfile = useStore((state) => state.userProfile);

	const initials = userProfile.name.split(' ').map((n) => n[0]).join('');

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
			{router.pathname !== '/onboard' && (
				<NavigationMenu>
					<NavigationMenuList className="space-x-4">
						{userRoles.find((role) => role.project === currentProject && role.role.access_admin_panel) && (
							<NavigationMenuItem>
								<Button variant="outline"
								        onClick={() => router.push(`/projects/${currentProject}/management`)}>
									Management
								</Button>
							</NavigationMenuItem>
						)}
						<NavigationMenuItem>
							<Button className="bg-[#E1E5DE] hover:border hover:border-[#E1E5DE]" variant="ghost"
							        onClick={() => router.push('/projects/pid-76047bbe1fc241959bb636eaa4d6e27f/document/did-1569a552a4894b90af40f7a3d511abf4')}
							>
								User Guide
							</Button>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<ConnectWalletButton/>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost"
									        className="flex flex-row justify-center items-center gap-1.5 bg-[#E1E5DE] hover:border hover:border-[#E1E5DE]">
										<Image loading="lazy" src={userProfile.img_uri} alt={initials}
										       className="shrink-0 my-auto rounded-full aspect-square" width={32} height={32}/>
										<div className="text-sm text-neutral-950">{userProfile.name}</div>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
									<DropdownMenuItem onClick={() => {
										deleteCookie('stytch_session_jwt');
										router.push('/');
									}}>Log Out</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			)}
		</div>
	);
}
