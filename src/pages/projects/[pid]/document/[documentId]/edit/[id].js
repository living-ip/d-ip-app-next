import {authStytchRequest} from "@/lib/stytch";
import "@mdxeditor/editor/style.css";
import Editor from "@/components/edit/Editor";
import {useState} from "react";
import {useRouter} from "next/router";
import {getChange, publishChange, updateChange} from "@/lib/change";
import {getProject} from "@/lib/project";
import {getDocument} from "@/lib/document";
import {getCookie} from "cookies-next";
import {EditChangeLayout} from "@/components/EditChangeLayout";
import {FiEdit3} from "react-icons/fi";


export default function Index({project, document, change}) {
	const decodedContent = Buffer.from(document.content, 'base64').toString("utf-8");
	const [pageData, setPageData] = useState(decodedContent);
	const router = useRouter();

	const editorCallback = (data) => {
		setPageData(data);
	};

	const saveHandler = async () => {
		console.log("Updating Change", pageData);
		const response = await updateChange(change.cid, {
			name: change.name,
			description: change.description,
			content: btoa(pageData),
		}, getCookie("stytch_session_jwt"));
		console.log(response);
		//TODO: Update with modal saying successfully saved
		await router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}`);
	};

	const publishHandler = async () => {
		console.log("Updating Change", pageData);
		const updateResponse = await updateChange(change.cid, {
			name: change.name,
			description: change.description,
			content: btoa(pageData),
		}, getCookie("stytch_session_jwt"));
		console.log(updateResponse);
		console.log("Publishing Change", pageData);
		await publishChange(change.cid, getCookie("stytch_session_jwt"));
		await router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote`);
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
						<Editor markdown={pageData} onChange={editorCallback}/>
					</section>
				</div>
			</div>
		</EditChangeLayout>
	);
}

export const getServerSideProps = async ({
	                                         req, query
                                         }) => {
	const {session} = await authStytchRequest(req);
	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	const {pid, documentId, id} = query;
	console.log("Pid: ", pid);
	console.log("Document ID: ", documentId);
	console.log("Change ID: ", id);

	const sessionJWT = req.cookies["stytch_session_jwt"];

	const project = await getProject(pid, sessionJWT);
	console.log("Project: ", project);
	const document = await getDocument(documentId, sessionJWT);
	console.log("Document: ", document);
	const change = await getChange(id, sessionJWT);
	console.log("Change: ", change);

	return {
		props: {
			project: project,
			document: document,
			change: change,
		},
	};
};
