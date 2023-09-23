import NavBar from "@/components/NavBar";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import UserCarousel from "@/components/ui/UserCarousel";
import ArticleCard from "@/components/ui/ArticleCard";
import prisma from "@/lib/prisma";
import {useState} from "react";
import {authStytchRequest} from "@/lib/stytch";
import {getPullRequestData} from "@/lib/github";

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
                        {/*TODO change this to the diff contributors*/}
                        <UserCarousel users={contributors}/>
                    </div>
                    <ArticleCard description={doc.description}/>
                </div>
                <div className="w-1/2 p-4 border-l ml-2 max-h-screen">
                    {/*    TODO code here for rendering the diff    */}
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
    const {name, id} = query;
    const data = await prisma.Document.findFirst({
        where: {
            name: name
        }
    })
    console.log(data)
    const changeData = await prisma.Change.findFirst({
        where: {
            cid: id
        }
    })
    console.log(changeData)
    const ghData = await getPullRequestData(data.owner, data.repo, changeData.prNumber, req.cookies["gho_token"]);
    console.log(ghData)
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
        },
    };
};
