import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

const MessageBackground = ({ role, children }) => {
  const bgColor = role === 'assistant' ? 'bg-green-100' : 'bg-accent';
  const alignment = role === 'assistant' ? 'justify-start' : 'justify-end';

  return (
    <div className={`flex ${alignment} w-full`}>
      <div className={`${bgColor} py-2 px-3 rounded-lg max-w-[94%]`}>
        {children}
      </div>
    </div>
  );
};

export default function Message({ message }) {
  const { role, content } = message;

  return (
    <div className={`flex ${role === 'assistant' ? 'items-start' : 'items-end'} gap-2 w-full mb-2`}>
      {role === 'assistant' && (
        <Bot className="h-5 w-5 mt-6 text-green-800 flex-shrink-0" />
      )}
      <MessageBackground role={role}>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown className="leading-normal">
            {content}
          </ReactMarkdown>
        </div>
      </MessageBackground>
    </div>
  );
}
