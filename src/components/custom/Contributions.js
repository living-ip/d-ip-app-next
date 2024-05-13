import {ContributionItem} from "@/components/custom/ContributionItem";
import * as React from "react";

export function Contributions({contributions}) {
  return (
    <>
      <div className="flex gap-0 self-start text-base font-medium leading-6 whitespace-nowrap text-neutral-950">
        <div className="justify-center pt-3 pb-4 border-b-2 border-lime-700 border-solid">
          Contributions
        </div>
      </div>
      {contributions.map((contribution, index) => (
        <ContributionItem key={index} name={contribution.name}
                          status={contribution.status} published_at={contribution.created_at}/>
      ))}
    </>
  );
}