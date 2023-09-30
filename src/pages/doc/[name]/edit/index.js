import NavBar from "@/components/NavBar";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import prisma from "@/lib/prisma";
import {getRepoPulls} from "@/lib/github";
import {authStytchRequest} from "@/lib/stytch";
import sha256 from "sha256";
import {Label} from "@/components/ui/label";

export default function Index({doc, changes}) {
    const router = useRouter();

    const onClick = () => {
        router.back();
    };

    const newEditHandler = (changeId) => {
        // TODO Create popup modal to create name and save to db, then route to /doc/[name]/edit/[changeId]
        router.push(`/doc/${doc.name}/edit/${changeId}`);
    };

    return (
        <NavBar>
            <h1 className="text-4xl font-extrabold m-1 pl-2">{doc.name}</h1>
            <Label className="m-1 pl-2">Your Changes</Label>
            <div>
                <Button variant="secondary" className="ml-2" onClick={onClick}>
                    Back
                </Button>
                <Button className="ml-2" onClick={newEditHandler}>
                    New Change
                </Button>
            </div>
            <div className="flex flex-col h-full mb-4 p-6">
                <div className="w-full">
                    {changes.map((change, index) => (
                        <div
                            key={index}
                            onClick={() => newEditHandler(change.id)}
                            className="border-b-2 py-4"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">{change.title}</h2>
                            </div>
                            <div className="flex justify-between mt-2">
                                <div className="text-sm text-gray-600">
                                    Last Edited: {change.updatedAt}
                                </div>
                                {
                                    change.submit ? (
                                        <div className="text-sm text-gray-600">
                                            Submitted
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-600">
                                            Not Submitted
                                        </div>
                                    )
                                }
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
    const document = await prisma.Document.findFirst({
        where: {
            name: name
        }
    })
    const changes = await prisma.Change.findMany({
        where: {
            suggestorId: session.userId,
        }
    })
    return {
        props: {
            doc: document,
            changes: [
                {
                    id: 1,
                    title: "Change 1",
                    submit: false
                }
            ]
        }
    }
}