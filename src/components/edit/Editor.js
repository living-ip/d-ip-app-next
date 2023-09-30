import {
    BoldItalicUnderlineToggles,
    codeBlockPlugin,
    linkPlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    UndoRedo,
    useCodeBlockEditorContext
} from "@mdxeditor/editor";
import {headingsPlugin} from "@mdxeditor/editor/plugins/headings";
import {listsPlugin} from "@mdxeditor/editor/plugins/lists";
import {quotePlugin} from "@mdxeditor/editor/plugins/quote";
import {MDXEditor} from "@mdxeditor/editor/MDXEditor";
import '@mdxeditor/editor/style.css';

export default function Editor({markdown}) {
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
        <MDXEditor
            // onChange={console.log}
            className="w-full h-full prose"
            markdown={markdown}
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
    )
}