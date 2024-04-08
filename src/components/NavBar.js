import {NavigationMenu, NavigationMenuItem,} from '@/components/ui/navigation-menu'
import React from 'react'
import Image from 'next/image'
import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";

export default function NavBar() {
  const router = useRouter();

  return (
    <div className={"flex pb-8 border-b border-gray-200 mx-auto max-w-full px-4 sm:px-8 lg:px-16"}>
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
      <div className="flex-1"/>
      <Button variant="outline" className="mt-8"
              onClick={() => router.push('/collections/LivingIP%20Product/document/cb26aba8-8188-4eb3-867c-2661c260b29c')}>
        User Guide
      </Button>
    </div>
  )
}
