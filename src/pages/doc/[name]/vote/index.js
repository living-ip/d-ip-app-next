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
    const pulls = await getRepoPulls(data.owner, data.repo, req.cookies["gho_token"])
    pulls.map((pull) => {
        pull.changeId = sha256(`${pull.head.repo.full_name}/${pull.number}`)
        console.log(pull.changeId)
    })
    // console.log(JSON.stringify(pulls))
    return {
        props: {
            doc: {
                name
            },
            changes: pulls
        }
    }
}