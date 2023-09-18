// components/ChapterCard.js
import Link from "next/link";
import ChapterSection from "@/components/doc/ChapterSection";

function ChapterCard({chapter}) {
    return (
        <div className="pointer-events-auto flex flex-col w-full last:pb-16">
            <Link href={chapter.slug}
                  className="text-black no-underline cursor-pointer flex mt-[18px] mb-4 font-suisse text-[15px] sm:text-lg font-bold leading-6">
                {chapter.title}
            </Link>
            <div className="flex flex-col w-full border border-gray-300 rounded-xl">
                {chapter.sections.map((section, index) => (
                    <ChapterSection href={section.slug} name={section.title} key={index}/>
                ))}
            </div>
        </div>
    );
}

export default ChapterCard;
