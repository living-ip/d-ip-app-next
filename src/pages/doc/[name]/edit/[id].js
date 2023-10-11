import NavBar from "@/components/NavBar";
import {authStytchRequest} from "@/lib/stytch";
import '@mdxeditor/editor/style.css';
import EditMenu from "@/components/edit/EditMenu";
import Editor from "@/components/edit/Editor";
import {getDocAndChange} from "@/lib/dbHelpers";
import {getGithubContents, updateGithubFile} from "@/lib/github";
import {useState} from "react";
import {getCookie} from "cookies-next";
import {useRouter} from "next/router";
import { submitChange, updateChange } from "@/lib/change";


export default function Index({doc, change, contents}) {
    const originalDoc = Buffer.from(contents.content, 'base64').toString('utf-8')
    const [pageData, setPageData] = useState(originalDoc)
    const router = useRouter();

    const editorCallback = (data) => {
        setPageData(data)
    }

    const saveHandler = async () => {
        console.log('Updating Change', pageData);
        const response = await updateChange(change.cid, pageData);
        console.log(response);
        router.push(`/doc/${encodeURIComponent(doc.name)}`);
    }

    const submitHandler = async () => {
        const response = await submitChange(change.cid);
        console.log(response);
        router.push(`/doc/${encodeURIComponent(doc.name)}`);
    }

    return (
        <NavBar>
            <EditMenu saveHandler={saveHandler} submitHandler={submitHandler}/>
            <div className="flex justify-center items-center h-screen">
                <div className="flex h-full w-3/4 border border-gray-300 shadow-lg rounded-lg p-4 mt-2">
                    <Editor markdown={originalDoc} onChange={editorCallback}/>
                </div>
            </div>
        </NavBar>
    );
}


export const getServerSideProps = async ({req, query}) => {
    const session = await authStytchRequest(req)
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    const {name, id} = query
    const {document, change} = await getDocAndChange(name, id)
    console.log(document, change)
    const ghData = await getGithubContents(document.owner, document.repo, change.lastEditFilePath, change.branchName, req.cookies["gho_token"])
    console.log(ghData)
    return {
        props: {
            doc: document,
            change,
            contents: ghData,
        }
    }
}