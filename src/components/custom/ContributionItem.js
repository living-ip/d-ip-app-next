import Image from "next/image";
import {Separator} from "@/components/ui/separator";
import * as React from "react";

export function ContributionItem({name, status, published_at}) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-5 justify-between py-2 w-full max-md:flex-wrap max-md:max-w-full">
        <div className="flex gap-3 max-md:flex-wrap">
          <div className="flex justify-center items-center p-2.5 w-8 h-8 bg-stone-100 rounded-[100px]"><Image
            loading="lazy" src={"/profile/edit-04.svg"} alt="Contribution Icon" className="w-4 aspect-square" width={16} height={16}/>
          </div>
          <div className="flex gap-1 my-auto text-base leading-6">
            <div className="text-neutral-600"> Published change in</div>
            <div className="font-medium text-neutral-950">{name}</div>
          </div>
        </div>
        <div className="flex gap-3 my-auto">
          <div
            className={`justify-center px-2 py-0.5 text-xs font-medium leading-4 whitespace-nowrap rounded-[100px] ${status === "Approved" ? "bg-[#D9E3D3] text-lime-950" : "text-red-700 bg-red-100"}`}> {status} </div>
          <div className="text-sm leading-5 text-zinc-500">{published_at}</div>
        </div>
      </div>
      <Separator/>
    </div>
  );
}