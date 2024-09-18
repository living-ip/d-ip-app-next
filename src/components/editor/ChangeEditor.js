"use client";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
  filterSuggestionItems,
} from "@blocknote/core";
import {
  useCreateBlockNote,
  SuggestionMenuController,
  createReactInlineContentSpec
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { updateChangeContent, uploadChangeFile } from "@/lib/change";
import { getProjectDocuments } from "@/lib/project";

// Custom inline content type for document links
const DocumentLink = createReactInlineContentSpec(
  {
    type: "documentLink",
    propSchema: {
      documentId: { default: "" },
      documentName: { default: "" },
      projectId: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => (
      <a href={`/projects/${props.inlineContent.props.projectId}/document/${props.inlineContent.props.documentId}`} target="_blank">
        {props.inlineContent.props.documentName}
      </a>
    ),
  }
);

// Create a custom schema with our document link inline content
const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    documentLink: DocumentLink,
  },
});

export default function Editor({ projectId, documentName, change, blocksContent, initialMarkdown, setMarkdown }) {

  const uploadFileHandler = async (file) => {
    const r = await uploadChangeFile(change.cid, file, getAuthToken());
    return r.uri || "";
  };

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
    uploadFile: uploadFileHandler,
    schema,
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
  }, [blocks, blocksContent, editor, initialMarkdown, setMarkdown]);

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

  // Function to get document items for the suggestion menu
  const getDocumentMenuItems = async (query) => {
    const documents = await getProjectDocuments(projectId, getAuthToken());

    return documents
      .filter((doc) => doc.name.toLowerCase().includes(query.toLowerCase())
          && doc.name !== documentName)
      .map((doc) => ({
        title: doc.name,
        onItemClick: () => {
          editor.insertInlineContent([
            {
              type: "documentLink",
              props: {
                documentId: doc.did,
                documentName: doc.name,
                projectId: doc.project_id
              },
            },
            " ", // add a space after the link
          ]);
        },
      }));
  };

  return (
    <BlockNoteView editor={editor}>
      <SuggestionMenuController
        triggerCharacter="@"
        getItems={async (query) => filterSuggestionItems(await getDocumentMenuItems(query), query)}
      />
    </BlockNoteView>
  );
}