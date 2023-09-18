import Link from "next/link";

export default function ChapterSection({href, name}) {
    return (
        <Link href={href}
              className="text-black no-underline cursor-pointer flex flex-row items-center font-inter text-sm box-border w-full py-2 px-3 m-0 border-b border-gray-300 last:border-none first:rounded-t-xl last:rounded-b-xl hover:bg-gray-50 active:bg-gray-100">
            {name}
        </Link>
    )
}