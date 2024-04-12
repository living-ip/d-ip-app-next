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

import {Button} from "@/components/ui/button";
import {DynamicWidget} from "@dynamic-labs/sdk-react-core";

export default function NavBar() {
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
      <div className="space-x-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/admin" legacyBehavior passHref>
                <NavigationMenuLink className="border border-gray-200 items-center justify-center rounded-xl p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Admin
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="outline" className="p-6 rounded-xl mx-4"
                      onClick={() => router.push('/collections/LivingIP%20Product/document/cb26aba8-8188-4eb3-867c-2661c260b29c')}>
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
    </div>
  );
}
