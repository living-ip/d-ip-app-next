"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import {updateSubmissionContent, uploadEditorDoc} from "@/lib/creations";
import {useRouter} from "next/router";
import {getAuthToken} from "@dynamic-labs/sdk-react-core"

export default function Editor({ creation, content }) {
	const router = useRouter()

	const uploadFileHandler = async (file) => {
		const r = await uploadEditorDoc(router.query.pid, router.query.creid, creation.ucid, file, getAuthToken());
		return r.uri || "";
	}

	let blocks;
	if (content) {
		try {
			blocks = JSON.parse(content)
		} catch (error) {
			console.error("Failed to parse note content:", error);
		}
	}
	const editor = useCreateBlockNote({
		initialContent: blocks,
		uploadFile: uploadFileHandler
	});

	const saveNote = useCallback(
		debounce(async (content) => {
			try {
				await updateSubmissionContent(router.query.pid, router.query.creid, creation.ucid, content, getAuthToken());
				console.log("Note saved:", content);
			} catch (error) {
				console.error("Failed to save note:", error);
			}
		}, 2000),
		[creation]
	);

	editor.onEditorContentChange(() => {
		const blocks = editor.document;
		saveNote(JSON.stringify(blocks));
	});

	return <BlockNoteView editor={editor} />;
}
