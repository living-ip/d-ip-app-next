import React, { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import * as Selection from 'selection-popover'
import * as Toolbar from '@radix-ui/react-toolbar'
import { FilePlus, Edit, MessageSquare } from 'lucide-react'

export default function ReadingPane({content}) {
  const [selectedText, setSelectedText] = useState('');

  const handleTextSelection = useCallback((event) => {
    setSelectedText(event.detail);
  }, []);

  useEffect(() => {
    document.addEventListener('textSelected', handleTextSelection);
    return () => {
      document.removeEventListener('textSelected', handleTextSelection);
    };
  }, [handleTextSelection]);

  const handleCreateSubDocument = useCallback(() => {
    console.log('Creating new sub-document with:', selectedText);
    // Implement your logic here
  }, [selectedText]);

  const handleEdit = useCallback(() => {
    console.log('Editing:', selectedText);
    // Implement your logic here
  }, [selectedText]);

  const handleComment = useCallback(() => {
    console.log('Commenting on:', selectedText);
    // Implement your logic here
  }, [selectedText]);

  return (
    <Selection.Root whileSelect>
      <Selection.Trigger>
        <div
          className="prose-lg"
          onMouseUp={() => {
            const selection = window.getSelection();
            if (selection && selection.toString().trim() !== '') {
              const event = new CustomEvent('textSelected', { detail: selection.toString() });
              document.dispatchEvent(event);
            }
          }}
        >
          <ReactMarkdown className="text-[#525252]">{content}</ReactMarkdown>
        </div>
      </Selection.Trigger>
      <Selection.Portal>
        <Selection.Content asChild>
          <Toolbar.Root className="flex p-2 space-x-2 bg-white rounded-lg shadow-md">
            <Toolbar.Button
              className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              aria-label="Create new sub-document"
              onClick={handleCreateSubDocument}
            >
              <FilePlus size={16} className="mr-2" />
              <span>New Sub-doc</span>
            </Toolbar.Button>
            <Toolbar.Separator className="w-[1px] bg-gray-300 mx-1" />
            <Toolbar.Button
              className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              aria-label="Edit"
              onClick={handleEdit}
            >
              <Edit size={16} className="mr-2" />
              <span>Edit</span>
            </Toolbar.Button>
            <Toolbar.Separator className="w-[1px] bg-gray-300 mx-1" />
            <Toolbar.Button
              className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              aria-label="Comment"
              onClick={handleComment}
            >
              <MessageSquare size={16} className="mr-2" />
              <span>Comment</span>
            </Toolbar.Button>
            <Selection.Arrow className="fill-white" />
          </Toolbar.Root>
        </Selection.Content>
      </Selection.Portal>
    </Selection.Root>
  )
}