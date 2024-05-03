import * as React from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";

const ProfileImage = ({ src, alt }) => (
  <Image src={src} alt={alt} width={80} height={80} className="mt-4 w-20 aspect-square" />
);

const InputField = ({ label, placeholder }) => (
  <>
    <div className="mt-3 font-medium leading-[143%] text-neutral-800 max-md:max-w-full">{label}</div>
    <div className="justify-center px-4 py-2.5 mt-2 bg-white rounded border border-gray-200 border-solid leading-[143%] text-zinc-400 max-md:max-w-full">
      {placeholder}
    </div>
  </>
);

function editProfile() {
  const router = useRouter();
  return (
    <div className="flex flex-col pb-20 bg-neutral-100">
      <header className="flex gap-5 justify-between px-8 py-3 w-full max-md:flex-wrap max-md:px-5 max-md:max-w-full">
        <Image src="/profile/Logo-Design-Full-Color-Black.svg" alt="" width={110} height={24} className="shrink-0 my-auto max-w-full aspect-[4.55] w-[110px]" />
        <div className="flex gap-1.5 px-2 py-1 rounded">
          <Image src="/profile/Profile_Picture.svg" alt="Profile avatar" width={32} height={32} className="shrink-0 my-auto w-8 rounded-full aspect-square" />
          <div className="flex flex-col">
            <div className="text-sm leading-5 text-neutral-950">Martin Park</div>
            <div className="text-xs leading-4 text-zinc-500">0xj7...k68</div>
          </div>
        </div>
      </header>
      <main className="flex flex-col self-center px-20 py-8 w-full bg-white rounded-3xl shadow max-w-[1392px] max-md:px-5 max-md:max-w-full">
        <h1 className="text-3xl leading-9 text-neutral-950 max-md:max-w-full">Settings</h1>
        <div className="gap-5 pr-20 mt-8 w-2/3 max-md:w-full max-md:pr-5 max-md:max-w-full">
          <div className="flex flex-col text-sm max-md:max-w-full">
            <h2 className="text-lg font-medium leading-7 text-neutral-950 max-md:max-w-full">Personal info</h2>
            <p className="mt-2 leading-[143%] text-neutral-600 max-md:max-w-full">Update your personal details.</p>
            <InputField label="First name" placeholder="Your first name" />
            <InputField label="Last name" placeholder="Your last name" />
            <InputField label="Email address" placeholder="Enter your email address" />
            <h2 className="mt-8 text-lg font-medium leading-7 text-neutral-950 max-md:max-w-full">Profile</h2>
            <p className="mt-2 leading-[143%] text-neutral-600 max-md:max-w-full">Update your photo and profile details.</p>
            <div className="self-start mt-4 font-medium leading-[143%] text-neutral-950">Profile image</div>
            <ProfileImage src="/profile/Profile_Picture.svg" alt="User profile image" />
            <div className="mt-3 font-medium leading-[143%] text-neutral-800 max-md:max-w-full">Tag</div>
            <div className="flex gap-2 justify-between px-3 py-2 mt-2 rounded border border-solid bg-neutral-100 border-stone-200 max-md:flex-wrap">
              <div className="leading-6 text-slate-500">@</div>
              <div className="flex-1 my-auto leading-[143%] text-zinc-500 max-md:max-w-full">Your tag</div>
            </div>
            <div className="flex gap-3 mt-3 leading-[143%] max-md:flex-wrap">
              <div className="flex flex-col flex-1">
                <InputField label="Company" placeholder="Where you work?" />
              </div>
              <div className="flex flex-col flex-1">
                <InputField label="Position" placeholder="Your position" />
              </div>
            </div>
            <InputField label="Wallet" placeholder="Enter your chosen crypto wallet" />
            <Button className="justify-center self-end px-3 py-2 mt-8 text-base font-medium leading-6 text-white bg-lime-900 rounded"
                    onClick={() => router.push("/profile")}>
              Save changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default editProfile;