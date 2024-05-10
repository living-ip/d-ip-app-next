import Image from "next/image";
import * as React from "react";

export function ProfileHeader() {
  return (
    <div className="flex gap-5 justify-between py-3 w-full max-md:flex-wrap max-md:px-5 max-md:max-w-full">
      <Image loading="lazy" src="/profile/Logo-Design-Full-Color-Black.svg" alt="Company Logo"
             className="shrink-0 my-auto max-w-full aspect-[4.55] w-[110px]" width={110} height={24}/>
      <div className="flex gap-1.5 px-2 py-1 rounded">
        {/*TODO: Uncomment once user information is accessible in the Navbar*/}
        {/*<Image loading="lazy" src="/profile/Profile_Picture.svg" alt="Profile Picture"*/}
        {/*       className="shrink-0 my-auto w-8 rounded-full aspect-square" width={32} height={32}/>*/}
        {/*<div className="flex flex-col">*/}
        {/*  <div className="text-sm leading-5 text-neutral-950"> Martin Park</div>*/}
        {/*  <div className="text-xs leading-4 text-zinc-500">0xj7...k68</div>*/}
        {/*</div>*/}
      </div>
    </div>);
}