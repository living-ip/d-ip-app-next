import {NavigationMenu,} from '@/components/ui/navigation-menu'
import React from 'react'
import Image from 'next/image'
import {useRouter} from "next/router";

export default function NavBar({children}) {
  const router = useRouter();

  return (
    <NavigationMenu>
      <Image
        src="/living-ip.png"
        className="hidden sm:mr-4 sm:flex hover:cursor-pointer"
        width={40}
        height={40}
        alt="LivingIP"
        onClick={() => router.push('/')}
      />
    </NavigationMenu>
  )

  // const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  // return (
  // 	<>
  // 		<NavigationMenu>
  // 			<MobileNavigationToggle
  // 				isOpen={isMobileNavOpen}
  // 				onClick={() => setMobileNavOpen(!isMobileNavOpen)}
  // 			/>
  // 			<NavigationMenuList
  // 				className={`${isMobileNavOpen ? 'flex' : 'hidden'} lg:flex`}
  // 			>
  // 				<NavigationMenuItem>
  // 					<Link href="/" legacyBehavior passHref>
  // 						<NavigationMenuLink
  // 							className={navigationMenuTriggerStyle()}
  // 						>
  // 							Home
  // 						</NavigationMenuLink>
  // 					</Link>
  // 				</NavigationMenuItem>
  // 			</NavigationMenuList>
  // 		</NavigationMenu>
  // 		{children}
  // 	</>
  // )
}
