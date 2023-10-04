// components/ChapterCard.js
import Link from "next/link";
import ChapterSection from "@/components/doc/ChapterSection";
import {Label} from "@/components/ui/label";

function ChapterCard({chapter, setContent, showChapters}) {

    const sectionOnClick = (url) => {
        console.log(url);
        fetch(url).then((response) => {
            response.json().then((json) => {
                setContent(Buffer.from(json.content, 'base64').toString('utf-8'));
                showChapters(false)
            })
        })
    }


    return (
        <div className="pointer-events-auto flex flex-col w-full last:pb-16">
            <Label
              className="text-black no-underline cursor-pointer flex mt-[18px] mb-4 font-suisse text-[15px] sm:text-lg font-bold leading-6">
                {chapter.title}
            </Label>
            <div className="flex flex-col w-full border border-gray-300 rounded-xl">
                {chapter.sections.map((section, index) => (
                    <ChapterSection onClick={sectionOnClick} name={section.title} url={section.url} key={index}/>
                ))}
            </div>
        </div>
    );
}

export default ChapterCard;
