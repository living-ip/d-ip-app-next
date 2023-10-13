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
import { mergeChange, voteOnChange } from "@/lib/change";


export default function Index({doc, contributors, cid, ghData, user, votes, userVoteProp}) {
    const router = useRouter();
    const [showChapters, setShowChapters] = useState(false);
    const [totalVotes, setTotalVotes] = useState(votes || 0);
    const [userVote, setUserVote] = useState(userVoteProp);

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

    const incrementVote = async () => {
        const result = await voteOnChange(cid, {vote: 1})
        setTotalVotes(result.totalVotes);
        setUserVote(1);
    }

    const decrementVote = async () => {
        const result = await voteOnChange(cid, {vote: -1})
        setTotalVotes(result.totalVotes);
        setUserVote(-1);
    }

    const merge = async () => {
        const result = await mergeChange(cid)
        console.log(result)
        router.push(`/doc/${encodeURIComponent(doc.name)}`);
    }

    return (
        <NavBar>
            <div className="flex max-h-screen">
                <div className="w-1/4 p-4">
                    <h1 className="text-4xl font-extrabold m-1 pl-2">{ghData.response.title}</h1>
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
                    <ArticleCard description={ghData.response.body}/>
                    {user.walletAddress ? (<div className="mt-4">
                        <Button variant={userVote === -1 ? "" : "outline"} className="mx-2" onClick={decrementVote}>
                            -1
                        </Button>
                        <Button variant={userVote === 1 ? "" : "outline"} className="mx-2" onClick={incrementVote}>
                            +1
                        </Button>
                        Votes: {totalVotes}
                    </div>
                    ) : (
                        <div className="mt-4">
                            <Button variant="outline" className="mx-2" onClick={() => router.push("/wallet")}>
                                Connect wallet to vote
                            </Button>
                        </div>
                    )}
                    {totalVotes > 3 && (
                        <div className="mt-4">
                            <Button variant="outline" className="mx-2" onClick={merge}>
                                Merge
                            </Button>
                        </div>
                    )}
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
    const user = await prisma.User.findFirst({
        where: {
            uid: session.user_id,
        },
    });
    const voteAggregate = await prisma.Vote.aggregate({
        where: {
            changeId: id,
        },
        _sum: {
            vote: true,
        },
    });
    const userVote = await prisma.Vote.findFirst({
        where: {
            changeId: id,
            voterId: session.user_id,
        },
    });
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
            cid: id,
            ghData,
            user,
            votes: voteAggregate._sum.vote || 0,
            userVoteProp: userVote ? userVote.vote : 0,
        },
    };
};
