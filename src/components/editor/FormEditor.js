"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import {useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/shadcn";

export default function FormEditor({setEditorContent}) {
	const editor = useCreateBlockNote();

	editor.onEditorContentChange(() => {
		const blocks = editor.document;
		setEditorContent(JSON.stringify(blocks));
	});

	return <BlockNoteView editor={editor}/>;
}
