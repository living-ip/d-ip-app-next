import * as React from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {InputWithLabel} from "@/components/custom/SettingInputWithLabel";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {AiOutlineCamera} from "react-icons/ai";
import {useRef, useState} from "react";
import {useStore} from "@/lib/store";

const ProfileImage = ({ src, alt }) => (
  <Image src={src} alt={alt} width={80} height={80} className="mt-4 w-20 aspect-square" />
);

function editProfile() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [userData] = useStore((state) => [state.user]);
  // const [userImage, setUserImage] = useState(userData.image);
  const [userImage, setUserImage] = useState(null);

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Exclude "data:{mime};base64,"
      reader.onerror = (error) => reject(error);
    });
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserImage(file);
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
    }
    const image = {
      filename: file.name,
      content: await fileToBase64(file),
    };
    // await updateUserProfile(
    //   userData.uid,
    //   undefined,
    //   undefined,
    //   undefined,
    //   undefined,
    //   image
    // );
    console.log("Image uploaded successfully");
  };

  return (
    <div className="flex flex-col pb-20 bg-neutral-100 h-screen">
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
            <InputWithLabel label="First name" type="text" id="first-name" placeholder="Your first name goes here"/>
            <InputWithLabel label="Last name" type="text" id="last-name" placeholder="Your last name goes here"/>
            <InputWithLabel label="Email address" type="email" id="email" placeholder="Enter your email address"/>
            <h2 className="mt-8 text-lg font-medium leading-7 text-neutral-950 max-md:max-w-full">Profile</h2>
            <p className="mt-2 leading-[143%] text-neutral-600 max-md:max-w-full">Update your photo and profile
              details.</p>
            <div className="self-start mt-4 font-medium leading-[143%] text-neutral-950">Profile image</div>
            <ProfileImage src="/profile/Profile_Picture.svg" alt="User profile image"/>
            <div className="flex flex-col items-start mb-4 mt-2">
              <Avatar className="relative inline-block w-32 h-32">
                {userImage ? (
                  <AvatarImage
                    src={"/profile/Profile_Picture.svg"}
                    alt="Profile picture"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex justify-center items-center">
                    <AiOutlineCamera size={32} className="text-gray-600"/>
                  </div>
                )}
              </Avatar>
              <div className="flex mt-2">
                <Button
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded"
                >
                  {userImage ? "Change" : "Upload"}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-3 leading-[143%] max-md:flex-wrap">
              <div className="flex flex-col flex-1">
                <InputWithLabel label="Company" type="text" id="company" placeholder="Where you work?"/>
              </div>
              <div className="flex flex-col flex-1">
                <InputWithLabel label="Position" type="text" id="position" placeholder="Your position"/>
              </div>
            </div>
            <InputWithLabel label="Wallet" type="text" id="wallet" placeholder="Enter your chosen crypto wallet"/>
            <Button
              className="justify-center self-end px-3 py-2 mt-8 text-base font-medium leading-6 text-white bg-lime-900 rounded"
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