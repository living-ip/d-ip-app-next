import ReactMarkdown from "react-markdown";

export default function ReadingPane({content}) {
    return (
        <div className="prose-lg">
            <ReactMarkdown className="text-[#525252]">{content}</ReactMarkdown>
        </div>
    )
}