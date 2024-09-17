"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCallback } from "react";
import { debounce } from "lodash";
import {useRouter} from "next/router";
import {getAuthToken} from "@dynamic-labs/sdk-react-core"
import { updateChangeContent, uploadChangeFile } from "@/lib/change";
import { useEffect } from "react";

export default function Editor({ change, blocksContent, initialMarkdown, setMarkdown }) {
	const router = useRouter()

	const uploadFileHandler = async (file) => {
		const r = await uploadChangeFile(change.cid, file, getAuthToken());
		return r.uri || "";
	}

	let blocks;
	if (blocksContent) {
		try {
			blocks = JSON.parse(blocksContent);
		} catch (error) {
			console.error("Failed to parse note content:", error);
		}
	}
	const editor = useCreateBlockNote({
		initialContent: blocks,
		uploadFile: uploadFileHandler
	});

  useEffect(() => {
    if (editor && blocksContent) {
      // We have to convert the blocks to markdown to ensure that the state is updated, so that if you publish without making any changes, the markdown is still updated
      editor.blocksToMarkdownLossy(blocks).then((markdown) => {
        setMarkdown(markdown);
      });
    }
    if (editor && initialMarkdown) {
      console.log(initialMarkdown);
      (async () => {
        try {
          // Ensure content is a valid string
          if (typeof initialMarkdown === "string") {
            const parsedBlocks = await editor.tryParseMarkdownToBlocks(initialMarkdown);
            editor.replaceBlocks(editor.document, parsedBlocks);
            // We have to convert the blocks to markdown to ensure that the state is updated, so that if you publish without making any changes, the markdown is still updated
            editor.blocksToMarkdownLossy(blocks).then((markdown) => {
              setMarkdown(markdown);
            });
          } else {
            console.error("Content is not a valid string", initialMarkdown);
          }
        } catch (error) {
          console.error("Failed to parse note content:", error);
        }
      })();
    }
  }, [blocks, editor, initialMarkdown, setMarkdown]);

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
