import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import ReadingPane from "@/components/doc/ReadingPane";
import {authStytchRequest} from "@/lib/stytch";
import {getProject} from "@/lib/project";
import {getDocument} from "@/lib/document";
import Image from "next/image";
import {IoArrowBackOutline} from "react-icons/io5";


export default function Index({project, document}) {
	const router = useRouter();

	const Contributor = ({src, name}) => (
		<div className="flex gap-3 py-2 mt-1 text-base leading-6">
			<Image src={src} alt={name} className="shrink-0 w-6 aspect-square" width="24" height="24"/>
			<div>{name}</div>
		</div>
	);

	// TODO: Replace with actual contributors from API call
	const contributors = [
		{src: "/vercel.svg", name: "Martin Park"},
		{src: "/vercel.svg", name: "Martin Park"},
		{src: "/vercel.svg", name: "Martin Park"},
		{src: "/vercel.svg", name: "Martin Park"},
		{src: "/vercel.svg", name: "Martin Park"},
	];

	return (
		// TODO: Update with Layout component
		<div className="flex flex-col pb-20 bg-neutral-100">
			{/*TODO: New Navbar goes here*/}
			<main
				className="flex flex-col self-center px-20 py-8 w-full bg-white rounded-3xl shadow max-w-[1392px] max-md:px-5 max-md:max-w-full">
				<section className="flex gap-3 justify-between w-full max-md:flex-wrap max-md:max-w-full">
					<div className="flex flex-col w-[73%] max-md:max-w-full">
						<div className="flex gap-3 max-md:flex-wrap">
							<div
								className="flex justify-center items-center p-2.5 my-auto rounded-sm border border-gray-200 border-solid">
								<IoArrowBackOutline className="w-4 h-4 cursor-pointer" onClick={() => router.back()}/>
							</div>
							<div className="text-3xl leading-9 text-neutral-950 max-md:max-w-full">{document.name}</div>
						</div>
						<div className="mt-3 text-base leading-6 text-neutral-600 max-md:max-w-full">
							{document.description}
						</div>
						<div className="mt-2 text-sm leading-5 text-zinc-500 max-md:max-w-full">Last edit 14 April, 2024</div>
					</div>
					<div className="flex justify-center items-center gap-3 w-[27%] mt-24 max-md:mt-10">
						<Button variant="outline" onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/edit`)}>Log history</Button>
						<Button onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote`)}>Vote</Button>
					</div>
				</section>
				<article className="mt-6 max-md:max-w-full">
					<div className="flex gap-5 max-md:flex-col max-md:gap-0">
						<div className="flex flex-col w-[73%] max-md:ml-0 max-md:w-full">
							<div className="text-base text-neutral-600 h-full overflow-y-scroll">
								<ReadingPane content={Buffer.from(document.content, 'base64').toString("utf-8")}/>
							</div>
						</div>
						<aside className="flex flex-col ml-5 w-[27%] max-md:ml-0 max-md:w-full">
							<div className="flex flex-col grow text-neutral-950 max-md:mt-8">
								<div className="text-xl leading-7">Contributors</div>
								{contributors.map((contributor, index) => (
									<Contributor key={index} src={contributor.src} name={contributor.name}/>
								))}
								{/*	TODO: Add Want more content component*/}
							</div>
						</aside>
					</div>
				</article>
			</main>
		</div>
	)
		;
}

export const getServerSideProps = async ({req, query}) => {
	const {session} = await authStytchRequest(req);
	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	const {pid, documentId} = query;
	console.log("Pid: ", pid);
	console.log("Document ID: ", documentId);

	const sessionJWT = req.cookies["stytch_session_jwt"];

	const project = await getProject(pid, sessionJWT);
	console.log("Project: ", project);
	const document = await getDocument(documentId, sessionJWT);
	console.log("Document: ", document);

	return {
		props: {
			project,
			document,
		},
	};
};
