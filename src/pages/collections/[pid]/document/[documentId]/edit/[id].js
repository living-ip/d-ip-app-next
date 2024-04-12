import { authStytchRequest } from "@/lib/stytch";
import "@mdxeditor/editor/style.css";
import EditMenu from "@/components/edit/EditMenu";
import Editor from "@/components/edit/Editor";
import { useState } from "react";
import { useRouter } from "next/router";
import {publishChange, updateChange} from "@/lib/change";
import { Layout } from "@/components/ui/layout";
import {getProject} from "@/lib/project";
import {getDocument} from "@/lib/document";
import {getChange} from "@/lib/change";
import {getCookie} from "cookies-next";

export default function Index({ project, document, change }) {
  const decodedContent = atob(change.content)
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
    await router.push(`/collections/${encodeURI(project.pid)}/document/${document.did}`);
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
    await router.push(`/collections/${encodeURI(project.pid)}/document/${document.did}/vote`);
  };

  return (
    <Layout>
      <div className="flex flex-col w-full h-screen py-8">
        <div className="relative w-full p-4 border border-gray-300 rounded-lg shadow-lg">
          <EditMenu saveHandler={saveHandler} publishHandler={publishHandler} />
          <Editor markdown={pageData} onChange={editorCallback} />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ req, query }) => {
  const { session } = await authStytchRequest(req);
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
