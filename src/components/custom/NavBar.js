import Image from "next/image";
import {useRouter} from "next/router";
import {NavigationMenu, NavigationMenuItem, NavigationMenuList} from "@/components/ui/navigation-menu";
import {Button} from "@/components/ui/button";
import {useStore} from "@/lib/store";
import ConnectWalletButton from "@/components/button/ConnectWalletButton";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {useEffect, useState} from "react";
import {DynamicUserProfile, useDynamicContext} from "@dynamic-labs/sdk-react-core";

export function NavBar() {
	const router = useRouter();
	const [userRoles, currentProject, userProfile] = useStore((state) => [state.userRoles, state.currentProject, state.userProfile]);
	const {isAuthenticated, handleLogOut, setShowAuthFlow} = useDynamicContext();
	const [auth, setAuth] = useState(isAuthenticated);
	const [isMobile, setIsMobile] = useState(false);

	const initials = userProfile?.name?.split(' ').map((n) => n[0]).join('') || "LIP";

	const homeHandler = () => router.push(auth ? "/projects" : "/");

	const isAdmin = userProfile?.email === "dan@sibylline.xyz" || userProfile?.email === "m3taversal@gmail.com";

	const canAccessAdminPanel = userRoles.some((role) => role.project === currentProject && role.role.access_admin_panel);

	useEffect(() => {
		setAuth(isAuthenticated);
	}, [isAuthenticated]);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);

		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	const navItems = [
		...((canAccessAdminPanel && router.query.pid) ? [
			{
				label: "Management",
				onClick: () => router.push(`/projects/${currentProject}/management`),
			},
			{
				label: "Campaign",
				onClick: () => router.push(`/projects/${currentProject}/campaign`),
			}
		] : []),
		{
			label: "User Guide",
			onClick: () => router.push('/projects/pid-76047bbe1fc241959bb636eaa4d6e27f/document/did-1569a552a4894b90af40f7a3d511abf4'),
		},
	];

	return (
		<>

			<div className="flex items-center justify-between w-full px-4 py-3 lg:px-6">
				<Image
					src="/Logo-Design-Full-Color-Black.svg"
					alt="Company Logo"
					className="w-[110px] h-auto cursor-pointer"
					width={110}
					height={24}
					onClick={homeHandler}
					priority
				/>
				{router.pathname !== '/onboard' && (
					<NavigationMenu className="flex-grow justify-end">
						<NavigationMenuList className="flex items-center gap-2 sm:gap-4">
							{!isMobile && navItems.map((item, index) => (
								<NavigationMenuItem key={index}>
									<Button
										className="bg-[#E1E5DE] hover:bg-[#D1D5CE] text-black"
										variant="ghost"
										onClick={item.onClick}
									>
										{item.label}
									</Button>
								</NavigationMenuItem>
							))}
							{
								auth ? (
									<NavigationMenuItem>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost"
												        className="bg-[#E1E5DE] hover:bg-[#D1D5CE] text-black">
													<Avatar className="w-8 h-8 mr-2">
														<AvatarImage
															src={userProfile?.image_uri || "https://storage.googleapis.com/syb_us_cdn/cyber_future_da.png"}
															alt={initials}
														/>
													</Avatar>
													{userProfile?.name}
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												{isMobile && navItems.map((item, index) => (
													<DropdownMenuItem key={index} onSelect={item.onClick}>
														{item.label}
													</DropdownMenuItem>
												))}
												<DropdownMenuItem onSelect={() => {
												}}>
													<ConnectWalletButton/>
												</DropdownMenuItem>
												<DropdownMenuItem
													onSelect={() => router.push('/profile')}>Profile</DropdownMenuItem>
												{isAdmin && <DropdownMenuItem
													onSelect={() => router.push('/admin/')}>Admin</DropdownMenuItem>}
												<DropdownMenuItem onSelect={() => {
													handleLogOut().then(r => router.push('/'));
												}}>Log Out</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</NavigationMenuItem>
								) : (
									<Button onClick={() => {
										setShowAuthFlow(true)
									}}>Log In</Button>
								)
							}

						</NavigationMenuList>
					</NavigationMenu>
				)}
			</div>
			<DynamicUserProfile/>
		</>
	);
}
