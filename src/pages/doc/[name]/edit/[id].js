import NavBar from "@/components/NavBar";
import {authStytchRequest} from "@/lib/stytch";
import '@mdxeditor/editor/style.css';
import EditMenu from "@/components/edit/EditMenu";
import Editor from "@/components/edit/Editor";
import {getDocAndChange} from "@/lib/dbHelpers";
import {getGithubContents} from "@/lib/github";


export default function Index({doc, change, contents}) {
    console.log(doc, change)
    const originalDoc = Buffer.from(contents.content, 'base64').toString('utf-8')
    return (
        <NavBar>
            <EditMenu/>
            <div className="flex justify-center items-center h-screen">
                <div className="flex h-full w-3/4 border border-gray-300 shadow-lg rounded-lg p-4 mt-2">
                    <Editor markdown={originalDoc}/>
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