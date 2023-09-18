import ReactMarkdown from "react-markdown";

export default function ReadingPane({content}) {
    return (
        <div className="prose lg:prose-xl max-w-2xl mx-auto justify-center items-center">
            <ReactMarkdown className="text-gray-800">{content}</ReactMarkdown>
            <div className="pt-4"/>
            {/*<PageFooter nextPage={page.nextPage}/>*/}
        </div>
    )
}