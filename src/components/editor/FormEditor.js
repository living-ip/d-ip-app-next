// "use client"; // this registers <Editor> as a Client Component
// import "@blocknote/core/fonts/inter.css";
// import {useCreateBlockNote} from "@blocknote/react";
// import {BlockNoteView} from "@blocknote/shadcn";
//
// export default function FormEditor({setEditorContent}) {
// 	const editor = useCreateBlockNote();
//
// 	editor.onEditorContentChange(() => {
// 		const blocks = editor.document;
// 		setEditorContent(JSON.stringify(blocks));
// 	});
//
// 	return <BlockNoteView editor={editor}/>;
// }
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

const FormEditor = ({ value, onChange }) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full"
    />
  );
};

export default FormEditor;
