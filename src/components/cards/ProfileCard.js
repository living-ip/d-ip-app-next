import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {AiOutlineCamera} from "react-icons/ai";

export function ProfileCard({profile}) {
	const router = useRouter();
	return (
		<div className="bg-white rounded-xl shadow-md overflow-hidden">
			<div className="p-6 sm:p-8">
				<div className="flex justify-between items-start mb-6">
					<Avatar className="w-24 h-24 sm:w-32 sm:h-32">
						{profile.image_uri ? (
							<AvatarImage
								src={profile.image_uri}
								alt="Profile picture"
								className="rounded-full object-cover"
							/>
						) : (
							<div className="w-full h-full rounded-full bg-gray-100 flex justify-center items-center">
								<AiOutlineCamera size={32} className="text-gray-600"/>
							</div>
						)}
					</Avatar>
					<Button variant="ghost" onClick={() => router.push('/profile/edit')}>
						Edit
					</Button>
				</div>
				<div className="text-center mb-6">
					<h1 className="text-3xl sm:text-4xl text-neutral-950 mb-2">
						{profile.name}
					</h1>
				</div>
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<span className="text-zinc-500">Email</span>
						<span className="text-neutral-950">{profile.email}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-zinc-500">Joined</span>
						<span className="text-neutral-950">{new Date(profile.created_at).toLocaleDateString()}</span>
					</div>
				</div>
			</div>
		</div>
	);
}