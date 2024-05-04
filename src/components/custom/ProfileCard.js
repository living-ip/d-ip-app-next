import {useRouter} from "next/router";
import {useToast} from "@/components/ui/use-toast";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import * as React from "react";

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function () {
    console.log('Copying to clipboard was successful!');
  }, function (err) {
    console.error('Could not copy text: ', err);
  });
}

export function ProfileCard({profile}) {
  const router = useRouter();
  const {toast} = useToast()

  return (
    <div className="flex flex-col self-stretch px-6 py-5 mx-auto w-full bg-white rounded-xl max-md:pl-5 max-md:mt-10">
      <div
        className="flex gap-5 justify-between items-start self-end max-w-full text-sm font-medium leading-5 whitespace-nowrap text-neutral-500 w-[211px]">
        <Image loading="lazy" src={profile.image} alt="Profile Picture"
               className="shrink-0 mt-2 w-20 rounded-full aspect-square" width={80} height={80}/>
        <Button variant="ghost" onClick={() => router.push('/profile/edit')}>Edit</Button>
      </div>
      <div
        className="flex flex-col items-center px-14 mt-6 text-base leading-6 text-neutral-950 max-md:px-5 max-md:mr-2">
        <div className="self-stretch mt-3 text-4xl leading-10 text-center">{profile.name}</div>
        <div className="mt-2 text-center text-neutral-600">{profile.role} @ {profile.company}</div>
      </div>
      <div className="flex flex-col mt-6 w-full bg-white rounded-xl max-md:mr-2">
        <div className="flex gap-2.5 justify-between w-full whitespace-nowrap">
          <div className="text-base leading-6 text-center text-zinc-500">Projects</div>
          <div className="flex gap-2 my-auto text-xs font-medium leading-4 text-neutral-950">
            <div className="justify-center px-2 py-0.5 bg-stone-200 rounded-[100px]">Claynosaurz</div>
            <div className="justify-center px-2 py-0.5 bg-stone-200 rounded-[100px]">LivingIP</div>
          </div>
        </div>
        <div
          className="flex gap-2.5 justify-between mt-3 w-full text-base leading-6 text-center whitespace-nowrap text-zinc-500">
          <div>Wallet</div>
          <div className="flex gap-1 justify-between pr-1.5">
            <div>{profile.walletAddress}</div>
            <Image
              className="shrink-0 my-auto w-3 aspect-square hover:cursor-pointer" width={12} height={12}
              loading="lazy" src="/profile/copy-01.svg" alt="Copy Icon"
              onClick={() => {
                copyToClipboard(profile.walletAddress)
                toast({
                  description: "Wallet address copied to clipboard",
                })
              }}
            />
          </div>
        </div>
        <div className="flex gap-2.5 justify-between mt-3 text-base leading-6 text-center">
          <div className="text-zinc-500">Email</div>
          <div className="text-neutral-950">{profile.email}</div>
        </div>
        <div className="flex gap-2.5 justify-between mt-3 text-base leading-6 text-center">
          <div className="text-zinc-500">Joined</div>
          <div className="text-neutral-950">{profile.dateJoined}</div>
        </div>
      </div>
    </div>
  );
}