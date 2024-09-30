import React from 'react';
import ReactMarkdown from "react-markdown";
import * as Selection from 'selection-popover'
import * as Toolbar from '@radix-ui/react-toolbar'
import { FilePlus, Edit, MessageSquare } from 'lucide-react'

export default function ReadingPane({content}) {
  return (
    <Selection.Root>
      <Selection.Trigger>
        <div className="prose-lg">
          <ReactMarkdown className="text-[#525252]">{content}</ReactMarkdown>
        </div>
      </Selection.Trigger>
      <Selection.Portal>
        <Selection.Content asChild>
          <Toolbar.Root className="flex p-1 space-x-1 bg-white rounded-lg shadow-md">
            <Toolbar.Button className="p-2 text-gray-700 hover:bg-gray-100 rounded" aria-label="Create new sub-document">
              <FilePlus size={20} />
            </Toolbar.Button>
            <Toolbar.Separator className="w-[1px] bg-gray-300 mx-1" />
            <Toolbar.Button className="p-2 text-gray-700 hover:bg-gray-100 rounded" aria-label="Edit">
              <Edit size={20} />
            </Toolbar.Button>
            <Toolbar.Separator className="w-[1px] bg-gray-300 mx-1" />
            <Toolbar.Button className="p-2 text-gray-700 hover:bg-gray-100 rounded" aria-label="Comment">
              <MessageSquare size={20} />
            </Toolbar.Button>
            <Selection.Arrow className="fill-white" />
          </Toolbar.Root>
        </Selection.Content>
      </Selection.Portal>
    </Selection.Root>
  )
}