import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
	MobileNavigationToggle,
} from '@/components/ui/navigation-menu'
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavBar({ children }) {
	const [isMobileNavOpen, setMobileNavOpen] = useState(false)
	return (
		<>
			<NavigationMenu>
				<MobileNavigationToggle
					isOpen={isMobileNavOpen}
					onClick={() => setMobileNavOpen(!isMobileNavOpen)}
				/>
				<NavigationMenuList
					className={`${isMobileNavOpen ? 'flex' : 'hidden'} lg:flex`}
				>
					<NavigationMenuItem>
						<Link href="/" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Home
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/publications" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Publications
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/logout" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
							>
								Logout
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			{children}
		</>
	)
}
