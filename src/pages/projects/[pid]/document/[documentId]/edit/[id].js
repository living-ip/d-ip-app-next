import "@mdxeditor/editor/style.css";
import {useState} from "react";
import {useRouter} from "next/router";
import {getChange, publishChange, updateChange} from "@/lib/change";
import {getProject} from "@/lib/project";
import {getDocument} from "@/lib/document";
import {EditChangeLayout} from "@/components/EditChangeLayout";
import {FiEdit3} from "react-icons/fi";
import {useToast} from "@/components/ui/use-toast";
import {getAuthToken} from "@dynamic-labs/sdk-react-core";
import dynamic from "next/dynamic";

const ChangeEditor = dynamic(() => import("@/components/editor/ChangeEditor"), {ssr: false});

export default function Index({project, document, change, blocks, decodedMarkdown}) {
	const [markdown, setMarkdown] = useState(decodedMarkdown);
	const router = useRouter();
	const {toast} = useToast();

	const saveHandler = async () => {
		console.log("Updating Change", markdown);
		const response = await updateChange(change.cid, {
			name: change.name,
			description: change.description,
			content: Buffer.from(markdown, 'utf-8').toString('base64'),
		}, getAuthToken());
		console.log(response);
		await router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/edit`);
		toast({
			title: "Draft saved",
			description: "Your draft has been saved. To make it accessible to the public, you must publish it.",
		})
	};

	const publishHandler = async () => {
		console.log("Updating Change", markdown);
		const updateResponse = await updateChange(change.cid, {
			name: change.name,
			description: change.description,
			content: Buffer.from(markdown, 'utf-8').toString('base64'),
		}, getAuthToken());
		console.log(updateResponse);
		console.log("Publishing Change", markdown);
		await publishChange(change.cid, getAuthToken());
		await router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote`);
		toast({
			title: "Edit published",
			description: "Your edited submission has been made public and is now open for voting.",
		})
	};

	return (
		<EditChangeLayout saveHandler={saveHandler} publishHandler={publishHandler}>
			<div className="flex flex-col w-full h-screen py-8">
				<div className="relative w-full p-4 rounded-lg">
					<h1 className="flex gap-2 pr-20 text-3xl text-neutral-950 max-md:flex-wrap max-md:pr-5">
						<span>{document.name}</span>
						<FiEdit3 className="w-3 h-3 my-auto aspect-square"/>
					</h1>
					<section
						className="flex flex-col p-8 mt-8 text-base bg-white rounded-3xl shadow text-neutral-600 max-md:px-5 max-md:max-w-full">
						<ChangeEditor projectId={project.pid} documentName={document.name} change={change} blocksContent={blocks} initialMarkdown={decodedMarkdown} setMarkdown={setMarkdown}/>
					</section>
				</div>
			</div>
		</EditChangeLayout>
	);
}

export const getServerSideProps = async ({req, query}) => {
	const {pid, documentId, id} = query;
	const sessionJWT = req.cookies["x_d_jwt"];
	const [project, document, change] = await Promise.all([
		getProject(pid, sessionJWT),
		getDocument(documentId, sessionJWT),
		getChange(id, sessionJWT)
	]);

	if (!project || !document || !change) {
		return {
			redirect: {
				destination: `/projects/${pid}/documents/${documentId}`,  // Redirect path might need to be adjusted.
				permanent: false,
			},
		};
	}
	let blocks = "";
	let markdown = "";
	if (change.content_uri) {
		const bucketData = await fetch(change.content_uri);
		blocks = await bucketData.text();
	} else {
		markdown = Buffer.from(change.content, 'base64').toString('utf-8');
	}

	return {
		props: {
			project: project,
			document: document,
			change: change,
			blocks: blocks,
			decodedMarkdown: markdown,
		},
	};
};
