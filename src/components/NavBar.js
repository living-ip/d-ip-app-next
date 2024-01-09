import {NavigationMenu, NavigationMenuItem,} from '@/components/ui/navigation-menu'
import React from 'react'
import Image from 'next/image'
import {useRouter} from "next/router";

export default function NavBar({children}) {
  const router = useRouter();

  return (
    <div className={"pb-8 border-b border-gray-200 mx-auto max-w-full px-4 sm:px-8 lg:px-16"}>
      <NavigationMenu>
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
      </NavigationMenu>
    </div>
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
