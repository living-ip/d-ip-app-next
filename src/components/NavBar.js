import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import React from 'react'
import Image from 'next/image'
import {useRouter} from "next/router";
import Link from "next/link"


export default function NavBar({id}) {
  const router = useRouter();

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
      <div className="border border-gray-200 rounded">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/admin" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Admin
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

