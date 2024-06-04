import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import ReadingPane from "@/components/doc/ReadingPane";
import {authStytchRequest} from "@/lib/stytch";
import {getProject} from "@/lib/project";
import {getDocument} from "@/lib/document";
import Image from "next/image";
import {IoArrowBackOutline} from "react-icons/io5";
import {NewLayout} from "@/components/NewLayout";
import {WantMoreComponent} from "@/components/custom/WantMoreComponent";
import {getUserProfile} from "@/lib/user";
import {initializeStore} from "@/lib/store";


export default function Index({project, document}) {
	const router = useRouter();

	const Contributor = ({src, name}) => (
		<div className="flex gap-3 py-2 mt-1 text-base leading-6">
			{src && (
				<Image src={src} alt={name} className="shrink-0 w-6 aspect-square" width="24" height="24"/>
			)}
			<div>{name}</div>
		</div>
	);

	return (
		<NewLayout>
			<main
				className="flex flex-col self-center px-20 py-8 w-full bg-white rounded-3xl shadow max-md:px-5 max-md:max-w-full">
				<section className="flex flex-row max-md:flex-col gap-3 justify-between max-md:justify-center w-full">
					<div className="flex flex-col w-[73%] max-md:max-w-full">
						<div className="flex gap-3 max-md:flex-wrap">
							<Button variant="outline" className="p-2.5 rounded-sm border border-gray-200 border-solid">
								<IoArrowBackOutline className="w-4 h-4 cursor-pointer" onClick={() => router.back()}/>
							</Button>
							<div className="text-3xl leading-9 text-neutral-950 max-md:max-w-full">{document.name}</div>
						</div>
						<div className="mt-3 text-base leading-6 text-neutral-600 max-md:max-w-full">
							{document.description}
						</div>
						{/*TODO: Ben - update with last edit when served from the backend*/}
						{/*<div className="mt-2 text-sm leading-5 text-zinc-500 max-md:max-w-full">{document.lastEdit}</div>*/}
					</div>
					<div className="flex justify-end items-center gap-3 w-[27%] max-md:w-[100%] mt-24 max-md:mt-2">
						<Button variant="outline" disabled={true}>
							Log History
						</Button>
						<Button onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote`)}>
							Vote
						</Button>
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
								<div className="text-xl">Contributors</div>
								{document.contributors.map((contributor, index) => (
									// TODO: Not all users have image_uri
									<Contributor key={index} src={contributor.image_uri || undefined} name={contributor.name}/>
								))}
								<WantMoreComponent
									project={project}
									content={{
										title: "Want more content?",
										description: "If you notice something missing, get involved and make a change to the document!",
										buttonText: "Create Document Edit",
										buttonLink: `/projects/${encodeURI(project.pid)}/document/${document.did}/edit`,
									}}
								/>
							</div>
						</aside>
					</div>
				</article>
			</main>
		</NewLayout>
	);
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

	// get user
	const {userProfile} = await getUserProfile(session.user_id, sessionJWT);
	const zustandServerStore = initializeStore({
    user: userProfile,
  });

	return {
		props: {
			project: project || {},
			document: document || {},
			initialZustandState: JSON.parse(
          JSON.stringify(zustandServerStore.getState())),
		},
	};
};
