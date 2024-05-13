import {Separator} from "@/components/ui/separator";
import * as React from "react";

export function VoteItem({status, name, created_at}) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-5 justify-between py-2 w-full max-md:flex-wrap max-md:max-w-full">
        <div className="flex gap-2 text-base leading-6">
          <div className="text-neutral-600">Voted</div>
          <div
            className={`justify-center px-2 py-0.5 my-auto text-xs font-medium leading-4 whitespace-nowrap rounded-[100px] ${status === "Approve" ? "bg-[#D9E3D3] text-lime-950" : "text-red-700 bg-red-100"}`}> {status} </div>
          <div className="flex gap-1">
            <div className="text-neutral-600">in</div>
            <div className="font-medium text-neutral-950">{name}</div>
          </div>
        </div>
        <div className="my-auto text-sm leading-5 text-zinc-500">{created_at}</div>
      </div>
      <Separator/>
    </div>
  );
}