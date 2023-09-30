import NavBar from "@/components/NavBar";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import prisma from "@/lib/prisma";
import {authStytchRequest} from "@/lib/stytch";
import {Label} from "@/components/ui/label";
import {MDXEditor} from '@mdxeditor/editor/MDXEditor'
import {headingsPlugin} from '@mdxeditor/editor/plugins/headings'
import {listsPlugin} from '@mdxeditor/editor/plugins/lists'
import {quotePlugin} from '@mdxeditor/editor/plugins/quote'
import '@mdxeditor/editor/style.css';
import {
    BoldItalicUnderlineToggles,
    codeBlockPlugin,
    linkPlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    UndoRedo,
    useCodeBlockEditorContext
} from "@mdxeditor/editor";


export default function Index({doc, change}) {
    const router = useRouter();

    const onClick = () => {
        router.push(`/doc/${doc.name}`);
    };

    const changeCardClick = (changeId) => {
        // TODO Create popup modal to create name and save to db, then route to /doc/[name]/edit/[changeId]
        router.push(`/doc/${doc.name}/edit/${changeId}`);
    };

    const PlainTextCodeEditorDescriptor = {
        match: () => true,
        priority: 0,
        Editor: (props) => {
            const cb = useCodeBlockEditorContext()
            return (
                <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
                    <textarea rows={3} cols={20} defaultValue={props.code}
                              onChange={(e) => cb.setCode(e.target.value)}/>
                </div>
            )
        }
    }

    return (
        <NavBar>
            <h1 className="text-4xl font-extrabold m-1 pl-2">{doc.name}</h1>
            <Label className="m-1 pl-2">Draft: {change.id}</Label>
            <div>
                <Button variant="secondary" className="ml-2" onClick={onClick}>
                    Back
                </Button>
            </div>
            <div className="flex justify-center items-center h-screen">
            <div className="flex h-full w-3/4 border border-gray-300 shadow-lg rounded-lg p-4">
                    <MDXEditor
                        // onChange={console.log}
                        className="w-full h-full prose"
                        markdown={'Hello world!'}
                        plugins={[
                            codeBlockPlugin({codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor]}),
                            headingsPlugin(),
                            listsPlugin(),
                            linkPlugin(),
                            quotePlugin(),
                            markdownShortcutPlugin(),
                            toolbarPlugin({
                                toolbarContents: () => (<> <UndoRedo/><BoldItalicUnderlineToggles/></>)
                            })
                        ]}
                    />
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
                id: id
            }
        }
    }
}