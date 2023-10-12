import NavBar from "@/components/NavBar";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import prisma from "@/lib/prisma";
import {getRepoPulls} from "@/lib/github";
import {authStytchRequest} from "@/lib/stytch";
import sha256 from "sha256";

export default function Index({doc, changes}) {
    const router = useRouter();

    const onClick = () => {
        router.push(`/doc/${doc.name}`);
    };

    const changeCardClick = (changeId) => {
        router.push(`/doc/${doc.name}/vote/${changeId}`);
    };

    return (
        <NavBar>
            <h1 className="text-4xl font-extrabold m-1 pl-2">{doc.name}</h1>
            <div>
                <Button variant="secondary" className="ml-2" onClick={onClick}>
                    Back
                </Button>
            </div>
            <div className="flex flex-col h-full mb-4 p-6">
                <div className="w-full">
                    {changes.map((change, index) => (
                        <div
                            key={index}
                            onClick={() => changeCardClick(change.changeId)}
                            className="border-b-2 py-4"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">{change.title}</h2>
                                <div className="text-gray-500">{change.votes || 0} votes</div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <div className="text-sm text-gray-600">
                                    Submitted by {change.user.login}
                                </div>
                                <div className="text-sm text-gray-600">{change.body}</div>
                            </div>
                        </div>
                    ))}
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
    const {name} = query
    const data = await prisma.Document.findFirst({
        where: {
            name: name
        }
    })
    console.log(data)
    const pulls = await getRepoPulls(data.owner, data.repo, req.cookies["gho_token"]);

    const changeIds = pulls.map(pull => {
        return sha256(`${pull.head.repo.full_name}/${pull.number}`);
    });
    
    const publishedChanges = await prisma.Change.findMany({
        where: {
            cid: {
                in: changeIds
            },
            published: true
        }
    });

    console.log(publishedChanges);

    const changesWithVotes = await Promise.all(publishedChanges.map(async (change) => {
        const voteSum = await prisma.Vote.aggregate({
            where: {
                changeId: change.cid
            },
            _sum: {
                vote: true
            }
        });
      
        return {
            ...change,
            votes: voteSum._sum.vote || 0
        };
    }));

    const pullsWithVoteData = pulls.map(pull => {
        const changeId = sha256(`${pull.head.repo.full_name}/${pull.number}`);
        const changeData = changesWithVotes.find(change => change.cid === changeId);
        if (changeData) {
            return {
                ...pull,
                votes: changeData ? changeData.votes : 0,
                changeId
            };
        }
        return null;
    }).filter(pull => pull !== null);

    console.log(pullsWithVoteData);

    return {
        props: {
            doc: {
                name
            },
            changes: pullsWithVoteData
        }
    }
}