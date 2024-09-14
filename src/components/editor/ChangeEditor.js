"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCallback } from "react";
import { debounce } from "lodash";
import {useRouter} from "next/router";
import {getAuthToken} from "@dynamic-labs/sdk-react-core"
import { updateChangeContent, uploadChangeFile } from "@/lib/change";

export default function Editor({ change, content, setMarkdown }) {
	const router = useRouter()

	const uploadFileHandler = async (file) => {
		const r = await uploadChangeFile(change.cid, file, getAuthToken());
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
				await updateChangeContent(change.cid, content, getAuthToken());
				console.log("Note saved:", content);
			} catch (error) {
				console.error("Failed to save note:", error);
			}
		}, 2000),
		[change]
	);

  editor.onEditorContentChange(() => {
    const blocks = editor.document;
		saveNote(JSON.stringify(blocks));
    (async () => {
      try {
        editor.blocksToMarkdownLossy(blocks).then((markdown) => {
          setMarkdown(markdown);
        });
      } catch (error) {
        console.error("Failed to convert blocks to markdown:", error);
      }
    })();
  });

	return <BlockNoteView editor={editor} />;
}
