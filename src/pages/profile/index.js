import * as React from "react";
import Image from "next/image";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {useToast} from "@/components/ui/use-toast";

function ProfileHeader() {
  return (
    <div className="flex gap-5 justify-between px-8 py-3 w-full max-md:flex-wrap max-md:px-5 max-md:max-w-full">
      <Image loading="lazy" src="/profile/Logo-Design-Full-Color-Black.svg" alt="Company Logo"
             className="shrink-0 my-auto max-w-full aspect-[4.55] w-[110px]" width={110} height={24}/>
      <div className="flex gap-1.5 px-2 py-1 rounded">
        <Image loading="lazy" src="/profile/Profile_Picture.svg" alt="Profile Picture"
               className="shrink-0 my-auto w-8 rounded-full aspect-square" width={32} height={32}/>
        <div className="flex flex-col">
          <div className="text-sm leading-5 text-neutral-950"> Martin Park</div>
          <div className="text-xs leading-4 text-zinc-500">0xj7...k68</div>
        </div>
      </div>
    </div>);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function () {
    console.log('Copying to clipboard was successful!');
  }, function (err) {
    console.error('Could not copy text: ', err);
  });
}

function ProfileCard() {
  const router = useRouter();
  const {toast} = useToast()
  return (
    <div className="flex flex-col self-stretch px-6 py-5 mx-auto w-full bg-white rounded-xl max-md:pl-5 max-md:mt-10">
      <div
        className="flex gap-5 justify-between items-start self-end max-w-full text-sm font-medium leading-5 whitespace-nowrap text-neutral-500 w-[211px]">
        <Image loading="lazy" src="/profile/Profile_Picture.svg" alt="Profile Picture"
               className="shrink-0 mt-2 w-20 rounded-full aspect-square" width={80} height={80}/>
        <Button variant="ghost" onClick={() => router.push('/profile/edit')}>Edit</Button>
      </div>
      <div
        className="flex flex-col items-center px-14 mt-6 text-base leading-6 text-neutral-950 max-md:px-5 max-md:mr-2">
        <div className="self-stretch mt-3 text-4xl leading-10 text-center"> Sophie Taylor</div>
        <div className="mt-2 text-center text-neutral-600"><span className="text-neutral-600">CEO @ Cl</span> <span
          className="text-neutral-600">aynosaurz</span></div>
        <div className="mt-2 text-center text-zinc-500"> @sophietaylor</div>
      </div>
      <div className="flex flex-col mt-6 w-full bg-white rounded-xl max-md:mr-2">
        <div className="flex gap-2.5 justify-between w-full whitespace-nowrap">
          <div className="text-base leading-6 text-center text-zinc-500"> Projects</div>
          <div className="flex gap-2 my-auto text-xs font-medium leading-4 text-neutral-950">
            <div className="justify-center px-2 py-0.5 bg-stone-200 rounded-[100px]"> Claynosaurz</div>
            <div className="justify-center px-2 py-0.5 bg-stone-200 rounded-[100px]"> LivingIP</div>
          </div>
        </div>
        <div
          className="flex gap-2.5 justify-between mt-3 w-full text-base leading-6 text-center whitespace-nowrap text-zinc-500">
          <div>Wallet</div>
          <div className="flex gap-1 justify-between pr-1.5">
            <div>0xc0f...9586</div>
            <Image
              className="shrink-0 my-auto w-3 aspect-square hover:cursor-pointer" width={12} height={12}
              loading="lazy" src="/profile/copy-01.svg" alt="Copy Icon"
              onClick={() => {
                copyToClipboard("0xc0f...9586")
                toast({
                  description: "Wallet address copied to clipboard",
                })
              }}
            />
          </div>
        </div>
        <div className="flex gap-2.5 justify-between mt-3 text-base leading-6 text-center">
          <div className="text-zinc-500">Email</div>
          <div className="text-neutral-950">
            <span className="text-neutral-950">info@</span>
            <span className="text-neutral-950">Claynosaurz.com</span>
          </div>
        </div>
        <div className="flex gap-2.5 justify-between mt-3 text-base leading-6 text-center">
          <div className="text-zinc-500">Joined</div>
          <div className="text-neutral-950">14 April, 2024</div>
        </div>
      </div>
    </div>);
}

function ContributionItem({icon, title, status, date}) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-5 justify-between py-2 w-full max-md:flex-wrap max-md:max-w-full">
        <div className="flex gap-3 max-md:flex-wrap">
          <div className="flex justify-center items-center p-2.5 w-8 h-8 bg-stone-100 rounded-[100px]"><Image
            loading="lazy" src={icon} alt="Contribution Icon" className="w-4 aspect-square" width={16} height={16}/>
          </div>
          <div className="flex gap-1 my-auto text-base leading-6">
            <div className="text-neutral-600"> Published change in</div>
            <div className="font-medium text-neutral-950">{title}</div>
          </div>
        </div>
        <div className="flex gap-3 my-auto">
          <div
            className={`justify-center px-2 py-0.5 text-xs font-medium leading-4 whitespace-nowrap rounded-[100px] ${status === "Approved" ? "bg-[#D9E3D3] text-lime-950" : "text-red-700 bg-red-100"}`}> {status} </div>
          <div className="text-sm leading-5 text-zinc-500">{date}</div>
        </div>
      </div>
      <Separator/>
    </div>
  );
}

function VoteItem({status, title, date}) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-5 justify-between py-2 w-full max-md:flex-wrap max-md:max-w-full">
        <div className="flex gap-2 text-base leading-6">
          <div className="text-neutral-600">Voted</div>
          <div
            className={`justify-center px-2 py-0.5 my-auto text-xs font-medium leading-4 whitespace-nowrap rounded-[100px] ${status === "Approve" ? "bg-[#D9E3D3] text-lime-950" : "text-red-700 bg-red-100"}`}> {status} </div>
          <div className="flex gap-1">
            <div className="text-neutral-600">in</div>
            <div className="font-medium text-neutral-950">{title}</div>
          </div>
        </div>
        <div className="my-auto text-sm leading-5 text-zinc-500">{date}</div>
      </div>
      <Separator/>
    </div>
  );
}

function profilePage() {

  const contributions = [
    {
      icon: "/profile/edit-04.svg",
      title: "Claynosaurz Vision Statement",
      status: "Approved",
      date: "14 April, 2024",
    },
    {
      icon: "/profile/edit-04.svg",
      title: "Claynosaurz Vision Statement",
      status: "Rejected",
      date: "14 April, 2024",
    },
    {
      icon: "/profile/edit-04.svg",
      title: "Claynosaurz Vision Statement",
      status: "Approved",
      date: "14 April, 2024",
    },
  ];

  const votes = [
    {
      status: "Approve",
      title: "Mission & Vision Statement",
      date: "14 April, 2024",
    },
    {
      status: "Reject",
      title: "Mission & Vision Statement",
      date: "14 April, 2024",
    },
    {
      status: "Approve",
      title: "Mission & Vision Statement",
      date: "14 April, 2024",
    },
  ];

  return (
    <div className="flex flex-col justify-center pb-6 bg-neutral-100">
      <ProfileHeader/>
      <main
        className="flex justify-center items-center self-center px-16 py-8 w-full bg-white rounded-3xl shadow max-w-[1392px] max-md:px-5 max-md:max-w-full">
        <div className="w-full max-w-[1232px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <aside className="flex flex-col w-[32%] max-md:ml-0 max-md:w-full"><ProfileCard/></aside>
            <div className="flex flex-col ml-5 w-[68%] max-md:ml-0 max-md:w-full">
              <section className="flex flex-col grow pb-20 max-md:mt-10 max-md:max-w-full">
                <div
                  className="flex gap-0 self-start text-base font-medium leading-6 whitespace-nowrap text-neutral-950">
                  <div className="justify-center pt-3 pb-4 border-b-2 border-lime-700 border-solid"> Contributions</div>
                  <div className="shrink-0 px-4 py-3 w-px border-b border-gray-200 border-solid h-[52px]"/>
                </div>
                {contributions.map((contribution, index) => (
                  <ContributionItem key={index} icon={contribution.icon} title={contribution.title}
                                    status={contribution.status} date={contribution.date}/>))}
                <div
                  className="justify-center self-start pt-3 pb-3.5 mt-6 text-base font-medium leading-6 whitespace-nowrap border-b-2 border-lime-700 border-solid text-neutral-950"> Votes
                </div>
                {votes.map((vote, index) => (
                  <VoteItem key={index} status={vote.status} title={vote.title} date={vote.date}/>))} </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default profilePage;