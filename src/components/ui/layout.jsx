import React from 'react'
import NavBar from "@/components/NavBar";
import {Footer} from "@/components/ui/footer";
import {cn} from "@/lib/utils";

export function Layout({children, childClassName, ...props}) {
  return (
    <div {...props}>
      <div className="fixed top-0 w-full z-10 bg-white">
        <NavBar/>
      </div>
      <div className={cn('mx-auto max-w-full px-3 sm:px-16 lg:px-32 pt-24', childClassName)}>
        {children}
      </div>
      <div className={"mx-auto max-w-full px-8 sm:px-16 lg:px-32 mb-2 border-t border-gray-200"}>
        <Footer/>
      </div>
    </div>
  )
}