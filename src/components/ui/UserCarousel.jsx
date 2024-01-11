import Image from "next/image";

export default function UserCarousel({ users }) {
	return (
		<div className="flex mt-6 space-x-4 overflow-x-scroll">
			{users.map((user, index) => (
				<div key={index} className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full relative">
					<Image
						src={user.image}  // user.image is taken from twitter
						alt={user.name}
						className="rounded-full"
						layout="fill"
						objectFit="cover"
					/>
				</div>
			))}
		</div>
	)
}
