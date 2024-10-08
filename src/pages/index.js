import Image from "next/image";
import * as React from "react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link"
import {DynamicWidget, useDynamicContext} from "@dynamic-labs/sdk-react-core";

const FeaturePoint = ({src, title, description}) => (
	<div className="flex flex-col grow max-md:mt-10">
		<Image src={src} alt="" width={24} height={24}/>
		<div className="mt-3 text-base leading-6 text-neutral-950">{title}</div>
		<div className="mt-1 text-sm leading-5 text-neutral-600">{description}</div>
	</div>
);

const featurePoints = [
	{
		src: "/users.svg",
		title: "Community-Driven Decisions",
		description:
			"Amplify your community's voice with our transparent system for contributions and votes.",
	},
	{
		src: "/book-open.svg",
		title: "Merit-Based Rewards",
		description:
			"Assign reputation scores and grant more voting power to active contributors, enhancing meritocracy.",
	},
	{
		src: "/codesandbox.svg",
		title: "Immutable Record Keeping",
		description:
			"Ensure trust with a permanent, transparent log of document edits and voting history.",
	},
];

const SocialIcon = ({src, alt}) => (
	<Image src={src} alt={alt} width={20} height={20}/>
);

const socialIcons = [
	{src: "/social-icons/twitter.svg", alt: "Social icon 1"},
	{src: "/social-icons/discord.svg", alt: "Social icon 2"},
	{src: "/social-icons/telegram.svg", alt: "Social icon 3"},
	{src: "/social-icons/medium.svg", alt: "Social icon 4"},
];

export default function Home() {
	const {isAuthenticated} = useDynamicContext();
	const [auth, setAuth] = useState(isAuthenticated);

	return (
		<div className="bg-gradient-to-b from-[#002500] to-[#245D00]">
			<div
				className="her0-section flex flex-col overflow-hidden items-center px-5 w-full text-base font-medium leading-6 text-white max-md:max-w-full"
				style={{
					backgroundImage: `url('/landingpage/background.png')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<header
					className="flex items-center justify-between px-10 py-4 mt-2 w-full max-md:flex-wrap max-md:px-5 max-md:max-w-full">
					<div className="w-[110px] h-[24px]">
						<Image
							src="/landingpage/Logo-Design-Full-Color-White.png"
							alt="Logo"
							width={110}
							height={24}
							layout="fixed"
							style={{display: 'block', height: 'auto'}}
						/>
					</div>
					<div>
						{
							auth ? (
								<Link href={"/projects"}>
									<Button>Home</Button>
								</Link>

							) : (
								<DynamicWidget/>
							)
						}

					</div>
				</header>
				<h1
					className="relative mt-20 text-6xl text-center leading-[64px] w-[720px] max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-10">
					Give Your Community a <span className={"text-green-400"}>Voice</span>
				</h1>
				<p className="relative mt-3 leading-6 text-center w-[620px] max-md:max-w-full">
					LivingIP empowers organizations to harness the collective intelligence of their communities through
					gamified living documents, rewarding contributors with recognition and fostering continuous
					improvement.
				</p>
				{
					auth ? (
						<div className={"flex space-x-2"}>
							<Link href={"/projects"}>
								<Button variant={"secondary"} className={"mt-4"}>
									Projects
								</Button>
							</Link>
							<Link
								href={"/projects/pid-ce6b7d54c03840adb1f5390bbcf55e05/document/did-02b21de06ee646aeaaa4135c777d6a93"}>
								<Button className={"mt-4"}>
									Read TeleoHumanity Manifesto
								</Button>
							</Link>
						</div>

					) : (
						<div className={"flex space-x-2"}>
							<Link href={"/projects"}>
								<Button variant={"secondary"} className={"mt-4"}>
									Discover Projects
								</Button>
							</Link>
							<Link
								href={"/projects/pid-ce6b7d54c03840adb1f5390bbcf55e05/document/did-02b21de06ee646aeaaa4135c777d6a93"}>
								<Button className={"mt-4"}>
									Read TeleoHumanity Manifesto
								</Button>
							</Link>
						</div>
					)
				}
				<Image
					src="/landingpage/holder_application_screenshot.png"
					alt=""
					width={1062}
					height={541}
					className="mt-12 w-full aspect-[1.96] max-w-[1062px] max-md:mt-10 max-md:max-w-full"
				/>
			</div>
			<section
				className="flex justify-center items-center px-16 py-20 w-full bg-white max-md:px-5 max-md:max-w-full">
				<div className="w-full max-w-[1160px] max-md:max-w-full">
					<div className="flex gap-5 max-md:flex-col max-md:gap-0">
						{featurePoints.map((point, index) => (
							<div
								key={index}
								className={`flex flex-col w-[33%] max-md:ml-0 max-md:w-full ${
									index > 0 ? "ml-5" : ""
								}`}
							>
								<FeaturePoint {...point} />
							</div>
						))}
					</div>
				</div>
			</section>
			<footer
				className="flex flex-col justify-center px-10 py-8 w-full bg-white border-t border-gray-200 border-solid max-md:px-5 max-md:max-w-full">
				<div className="flex gap-0 justify-between max-md:flex-wrap">
					<div className="flex flex-1 gap-5 justify-between text-sm leading-5 text-zinc-500 max-md:flex-wrap">
						<Image
							src="/landingpage/Logo-Design-Full-Color-Black.svg"
							alt="Logo"
							width={110}
							height={24}
							className="shrink-0 max-w-full aspect-[4.55]"
						/>
						<div className="my-auto max-md:max-w-full">
							© Copyright 2024. All rights reserved.
						</div>
					</div>
					<div className="flex gap-5 justify-between my-auto">
						{socialIcons.map((icon, index) => (
							<SocialIcon key={index} {...icon} />
						))}
					</div>
				</div>
			</footer>
		</div>
	);
}
