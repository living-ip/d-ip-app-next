export default function UserCarousel({ users }) {
	return (
		<div className="flex mt-12 space-x-4 overflow-x-scroll">
			{users.map((user, index) => (
				<div
					key={index}
					className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full"
				>
					{/* Replace `user.image` with the correct property to display the user's image */}
					<img
						src={user.image}
						alt={user.name}
						className="rounded-full w-14 h-14"
					/>
				</div>
			))}
		</div>
	)
}
