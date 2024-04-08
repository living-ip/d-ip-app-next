import {faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import Image from "next/image";

export default function UserCarousel({users, anonymize = false}) {
	return (
		<div className="flex mt-6 space-x-4 overflow-x-scroll">
			{users.map((user, index) => (
				<div key={index} className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full relative">
					<Avatar image={user.image_uri} name={user.name} anonymize={anonymize}/> {/* "" is used to anonymize the user */}
				</div>
			))}
		</div>
	)
}

const Avatar = ({image, name, anonymize}) => {
	const generateConsistentColour = str => {
		let hash = 0;
		if (str === undefined || str.length === 0 || anonymize) {
			const letters = '0123456789ABCDEF';
			let color = '#';
			for (let i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		}
		for (let i = 0; i < str.length; i += 1) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		let colour = "#";
		for (let i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			colour += `00${value.toString(16)}`.slice(-2);
		}
		return colour;
	};

	return (
		<div>
			<div className="relative">
				{image && !anonymize ? (
					<Image
						src={image}
						alt={name}
						width={100}
						height={100}
						className="rounded-full"
					/>
				) : (
					<div
						className={"h-16 w-16 text-center text-white text-4xl rounded-full grid place-items-center overflow-hidden text-display-xs"}
						style={{
							backgroundColor: generateConsistentColour(name)
						}}
					>
						{name && name.length > 0 && !anonymize ? (
							name[0].toUpperCase()
						) : (
							<FontAwesomeIcon icon={faUser} size={"lg"} color={"black"}/>
						)}
					</div>
				)}
			</div>
		</div>
	);
};