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


export default function Index({doc, change, contents}) {
    const originalDoc = Buffer.from(contents.content, 'base64').toString('utf-8')
    const [pageData, setPageData] = useState(originalDoc)
    const router = useRouter();

    const editorCallback = (data) => {
        setPageData(data)
    }

    const saveHandler = async () => {
        console.log('Updating Change', pageData)
        const base64Data = Buffer.from(pageData, 'utf-8').toString('base64')
        console.log(doc, change)
        const response = await fetch(`/api/change/${change.cid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-sib-token': getCookie('stytch_session_jwt'),
                'x-sib-gho-token': getCookie('gho_token')
            },
            body: JSON.stringify({
                fileData: base64Data
            })
        })
        console.log(response)
        router.push(`/doc/${encodeURIComponent(doc.name)}`)
    }

    const submitHandler = async () => {
        console.log("Suppose this should get implemented.")
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