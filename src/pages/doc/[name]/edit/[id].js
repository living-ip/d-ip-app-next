import NavBar from "@/components/NavBar";
import {useRouter} from "next/router";
import prisma from "@/lib/prisma";
import {authStytchRequest} from "@/lib/stytch";
import '@mdxeditor/editor/style.css';
import EditMenu from "@/components/edit/EditMenu";
import Editor from "@/components/edit/Editor";


export default function Index({doc, change, markdown}) {
    return (
        <NavBar>
            <EditMenu/>
            <div className="flex justify-center items-center h-screen">
                <div className="flex h-full w-3/4 border border-gray-300 shadow-lg rounded-lg p-4 mt-2">
                    <Editor markdown={markdown}/>
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
    const document = await prisma.Document.findFirst({
        where: {
            name: name
        }
    })
    return {
        props: {
            doc: document,
            change: {
                id: id,
                title: "This is a test change"
            },
            markdown: "# TODO \n\n This is a test change"
        }
    }
}