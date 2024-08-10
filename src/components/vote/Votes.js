import {VoteItem} from "@/components/vote/VoteItem";
import * as React from "react";


export function Votes({votes}) {
  return (
    <>
      <div className="justify-center self-start pt-3 pb-3.5 mt-6 text-base font-medium leading-6 whitespace-nowrap border-b-2 border-lime-700 border-solid text-neutral-950">
        Votes
      </div>
      {votes.map((vote, index) => (
        <VoteItem key={index} status={vote.status} name={vote.name} created_at={vote.created_at}/>))}
    </>
  );
}