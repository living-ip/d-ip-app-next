import * as React from "react";
import {ProfileHeader} from "@/components/custom/ProfileHeader";
import {ProfileCard} from "@/components/custom/ProfileCard";
import {Contributions} from "@/components/custom/Contributions";
import {Votes} from "@/components/custom/Votes";


function profilePage() {

  const profile = {
    name: "Sophie Taylor",
    role: "CEO",
    company: "Claynosaurz",
    walletAddress: "0xc0f...9586",
    email: "info@Claynosaurz.com",
    image: "/profile/Profile_Picture.svg",
    dateJoined: "14 April, 2024",
  };

  const contributions = [
    {
      name: "Claynosaurz Vision Statement",
      status: "Approved",
      published_at: "14 April, 2024",
    },
    {
      name: "Claynosaurz Vision Statement",
      status: "Rejected",
      published_at: "14 April, 2024",
    },
    {
      name: "Claynosaurz Vision Statement",
      status: "Approved",
      published_at: "14 April, 2024",
    },
  ];


  const votes = [
    {
      status: "Approve",
      name: "Mission & Vision Statement",
      created_at: "14 April, 2024",
    },
    {
      status: "Reject",
      name: "Mission & Vision Statement",
      created_at: "14 April, 2024",
    },
    {
      status: "Approve",
      name: "Mission & Vision Statement",
      created_at: "14 April, 2024",
    },
  ];

  return (
    <div className="flex flex-col pb-6 bg-neutral-100 h-screen">
      <ProfileHeader/>
      <main
        className="flex justify-center items-center self-center px-16 py-8 w-full bg-white rounded-3xl shadow max-w-[1392px] max-md:px-5 max-md:max-w-full">
        <div className="w-full max-w-[1232px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <aside className="flex flex-col w-[32%] max-md:ml-0 max-md:w-full">
              <ProfileCard profile={profile}/>
            </aside>
            <div className="flex flex-col ml-5 w-[68%] max-md:ml-0 max-md:w-full">
              <section className="flex flex-col grow pb-20 max-md:mt-10 max-md:max-w-full">
                <Contributions contributions={contributions}/>
                <Votes votes={votes}/>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default profilePage;