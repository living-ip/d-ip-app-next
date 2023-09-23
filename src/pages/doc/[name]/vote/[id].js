import NavBar from "@/components/NavBar";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import UserCarousel from "@/components/ui/UserCarousel";
import ArticleCard from "@/components/ui/ArticleCard";
import prisma from "@/lib/prisma";
import {useState} from "react";
import {authStytchRequest} from "@/lib/stytch";
import {getPullRequestData} from "@/lib/github";
import {parseDiff, Diff, Hunk} from 'react-diff-view';

import 'react-diff-view/style/index.css';


export default function Index({doc, contributors, ghData}) {
    const router = useRouter();
    const [showChapters, setShowChapters] = useState(false);

    console.log(ghData)

    const goToVotes = () => {
        router.push(`/doc/${encodeURIComponent(doc.name)}/vote`);
    };

    const toggleChapters = () => {
        router.push(`/doc/${encodeURIComponent(doc.name)}`);
    }

    const files = parseDiff(ghData.diffData);

    const renderFile = ({oldRevision, newRevision, type, hunks}) => (
        <Diff key={oldRevision + '-' + newRevision} viewType="unified" diffType={type} hunks={hunks}>
            {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
        </Diff>
    );


    return (
        <NavBar>
            <div className="flex max-h-screen">
                <div className="w-1/4 p-4">
                    <h1 className="text-4xl font-extrabold m-1 pl-2">{doc.name}</h1>
                    <div className="mt-4">
                        <Button variant="outline" className="mx-2" onClick={goToVotes}>
                            Votes
                        </Button>
                        <Button className="mx-2" onClick={toggleChapters}>
                            Back to Reading
                        </Button>
                    </div>
                    <div className="mt-4 ml-2">
                        {/*TODO change this to the diff contributors*/}
                        <UserCarousel users={contributors}/>
                    </div>
                    <ArticleCard description={doc.description}/>
                </div>
                <div className="flex-1 max-w-full p-4 border-l ml-2 max-h-screen prose lg:prose-xl">
                    <div className="overflow-x-scroll overflow-y-scroll">
                        {files.map(renderFile)}
                    </div>
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
            ghData,
        },
    };
};
