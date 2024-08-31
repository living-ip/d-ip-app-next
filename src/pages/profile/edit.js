import * as React from "react";
import {useRef, useState} from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {AiOutlineCamera} from "react-icons/ai";
import {initializeStore, useStore} from "@/lib/store";
import {MainLayout} from "@/components/layouts/MainLayout";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile, getUserRoles, updateUserProfile} from "@/lib/user";
import {getProjects} from "@/lib/project";
import {getCookie} from "cookies-next";
import {Input} from "@/components/ui/input";
import {getAuthToken} from "@dynamic-labs/sdk-react-core";

export default function EditProfile() {
	const router = useRouter();
	const fileInputRef = useRef(null);
	const [userProfile] = useStore((state) => [state.userProfile]);
	const [userName, setUserName] = useState(userProfile.name);
	const [userImage, setUserImage] = useState(userProfile.image_uri || null);
	const [file, setFile] = useState(null);

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
			setFile(file);
			const imageUrl = URL.createObjectURL(file);
			setUserImage(imageUrl);
		}
		console.log("Image uploaded successfully");
	};

	const handleSaveProfile = async () => {
		const userDetails = {
			name: userName,
		}
		if (file) {
			userDetails.image = {
				filename: file.name,
				content: await fileToBase64(file),
			};
		}
		await updateUserProfile(userProfile.uid, userDetails, getAuthToken());
		console.log("Profile saved successfully");
		await router.push("/profile")
	}

	return (
		<MainLayout>
			<main
				className="flex flex-col self-center px-20 py-8 w-full bg-white rounded-3xl shadow max-md:px-5 max-md:max-w-full">
				<h1 className="text-3xl leading-9 text-neutral-950 max-md:max-w-full">Settings</h1>
				<div className="gap-5 pr-20 mt-8 w-1/3 max-md:w-full max-md:pr-5 max-md:max-w-full">
					<div className="flex flex-col text-sm max-md:max-w-full">
						<h2 className="text-lg font-medium leading-7 text-neutral-950 max-md:max-w-full">Personal info</h2>
						<p className="mt-2 leading-[143%] text-neutral-600 max-md:max-w-full">Update your personal details.</p>
						<Input
							className="col-span-2 mb-2"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
						/>
						{/*<InputWithLabel label="Email address" type="email" id="email" placeholder="Enter your email address"/>*/}
						<h2 className="mt-8 text-lg font-medium leading-7 text-neutral-950 max-md:max-w-full">Profile</h2>
						<p className="mt-2 leading-[143%] text-neutral-600 max-md:max-w-full">Update your photo and profile
							details.</p>
						<div className="self-start mt-4 font-medium leading-[143%] text-neutral-950">Profile image</div>
						<div className="flex flex-col items-start mb-4 mt-2">
							<Avatar className="relative inline-block w-32 h-32">
								{userImage ? (
									<AvatarImage
										src={userImage}
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
						<Button
							className="justify-center self-end px-3 py-2 mt-8 text-base font-medium leading-6 text-white bg-lime-900 rounded"
							onClick={handleSaveProfile}>
							Save changes
						</Button>
					</div>
				</div>
			</main>
		</MainLayout>
	);
}

export const getServerSideProps = async ({req}) => {
	const sessionJWT = req.cookies["x_d_jwt"];
    const { userProfile, roles } = await getUserProfile("TODO", sessionJWT);
	if (!userProfile) {
		return {
			redirect: {
				destination: "/onboard",
				permanent: false,
			},
		};
	}
	const projects = await getProjects(sessionJWT);
	const zustandServerStore = initializeStore({
		userProfile,
		userRoles: roles,
		currentProject: undefined,
	});
	return {
		props: {
			projects,
			initialZustandState: JSON.parse(
				JSON.stringify(zustandServerStore.getState())
			),
		},
	};
}
