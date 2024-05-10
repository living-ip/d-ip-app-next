import ReactMarkdown from "react-markdown";

export default function ReadingPane({content}) {
    return (
        <div className="prose justify-start items-center">
            <ReactMarkdown className="text-[#525252]">{content}</ReactMarkdown>
        </div>
    )
}