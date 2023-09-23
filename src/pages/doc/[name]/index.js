import NavBar from "@/components/NavBar";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import ReadingPane from "@/components/doc/ReadingPane";
import UserCarousel from "@/components/ui/UserCarousel";
import ArticleCard from "@/components/ui/ArticleCard";
import prisma from "@/lib/prisma";
import {useState} from "react";
import ChapterCard from "@/components/doc/ChapterCard";
import {authStytchRequest} from "@/lib/stytch";

export default function Index({doc, contributors, chapters, firstPage}) {
    const router = useRouter();
    const [showChapters, setShowChapters] = useState(false);
    const [pageContent, setPageContent] = useState(firstPage);

    const goToVotes = () => {
        router.push(`/doc/${encodeURIComponent(doc.name)}/votes`);
    };

    const toggleChapters = () => {
        setShowChapters(!showChapters);
    }


    return (
        <NavBar>
            <div className="flex">
                <div className="w-1/2 p-4">
                    <h1 className="text-4xl font-extrabold m-1 pl-2">{doc.name}</h1>
                    <div className="mt-4">
                        <Button variant="outline" className="mx-2" onClick={goToVotes}>
                            Votes
                        </Button>
                        <Button className="mx-2" onClick={toggleChapters}>
                            Chapters
                        </Button>
                    </div>
                    <div className="mt-4 ml-2">
                        <UserCarousel users={contributors}/>
                    </div>
                    <ArticleCard description={doc.description}/>
                </div>
                <div className="w-1/2 p-4 border-l ml-2 max-h-screen">
                    {showChapters ? (
                            <div>
                                {chapters.map((chapter, index) => {
                                    return (
                                        <ChapterCard key={index}
                                                     chapter={chapter}
                                                     setContent={setPageContent}
                                                     showChapters={setShowChapters}/>
                                    )
                                })}
                            </div>
                        )
                        : (
                            <div className="h-full bg-gray-50 p-4 overflow-y-scroll">
                                <ReadingPane content={pageContent}/>
                            </div>
                        )}
                </div>
            </div>
        </NavBar>
    );
}

export const getServerSideProps = async ({req, query}) => {
    const session = await authStytchRequest(req)
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    const {name} = query;
    const data = await prisma.Document.findFirst({
        where: {
            name: name
        }
    })
    console.log(data)
    const response = await fetch(`https://raw.githubusercontent.com/${data.owner}/${data.repo}/main/${data.chaptersFile}`)
    const chapters = await response.json()
    const pageResponse = await fetch(chapters[0].sections[0].url)
    const firstPage = await pageResponse.text()
    console.log(chapters)
    return {
        props: {
            contributors: [
                {
                    name: "Dan Miles",
                    image: "https://pbs.twimg.com/profile_images/1702390471488659456/_bvR4h5f_400x400.jpg"
                },
                {
                    name: "m3taversal",
                    image: "https://pbs.twimg.com/profile_images/1677306057457127424/e3aHKSEs_400x400.jpg"
                }
            ],
            doc: data,
            chapters,
            firstPage
        },
    };
};