"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import {updateSubmissionContent, uploadEditorDoc} from "@/lib/creations";
import {useRouter} from "next/router";
import {getAuthToken} from "@dynamic-labs/sdk-react-core"

export default function Editor({ creation, content, saveContent }) {
	const router = useRouter()

	const uploadFileHandler = async (file) => {
		// const r = await uploadEditorDoc(router.query.pid, router.query.creid, creation.ucid, file, getAuthToken());
		return r.uri || "";
	}

  const editor = useCreateBlockNote({
		uploadFile: uploadFileHandler
	});

  useEffect(() => {
    if (editor && content) {
      (async () => {
        try {
          // Ensure content is a valid string
          if (typeof content === "string") {
            const parsedBlocks = await editor.tryParseMarkdownToBlocks(content);
            editor.replaceBlocks(editor.document, parsedBlocks);
          } else {
            console.error("Content is not a valid string", content);
          }
        } catch (error) {
          console.error("Failed to parse note content:", error);
        }
      })();
    }
  }, [editor, content]);

	// const saveNote = useCallback(
	// 	debounce(async (content) => {
	// 		try {
	// 			await updateSubmissionContent(router.query.pid, router.query.creid, creation.ucid, content, getAuthToken());
	// 			console.log("Note saved:", content);
	// 		} catch (error) {
	// 			console.error("Failed to save note:", error);
	// 		}
	// 	}, 2000),
	// 	[creation]
	// );

  editor.onEditorContentChange(() => {
    (async () => {
      try {
        const blocks = editor.document;
        const markdownContent = await editor.blocksToMarkdownLossy(blocks);
        saveContent(markdownContent); // Call saveContent with converted markdown
      } catch (error) {
        console.error("Failed to convert blocks to markdown:", error);
      }
    })(); // Self-invoking async function
  });

	return <BlockNoteView editor={editor} />;
}
