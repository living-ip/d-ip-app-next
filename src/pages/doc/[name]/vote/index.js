import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import prisma from "@/lib/prisma";
import {getRepoPulls} from "@/lib/github";
import {authStytchRequest} from "@/lib/stytch";

export default function Index({doc, changes}) {

    const router = useRouter();

    const onClick = () => {
        router.push(`/doc/${doc.name}`)
    }

    return (
        <NavBar>
            <h1 className="text-4xl font-extrabold m-1 pl-2">{doc.name}</h1>
            <div>
                <Button variant="secondary" className="ml-2" onClick={onClick}>Back</Button>
            </div>
            <div className="flex flex-col h-full mb-4 p-6">
                <div className="md:grid md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                    {changes.map((change, index) => (
                        <div key={index} onClick={() => handleClick(change.title)}>
                            <Card className="w-[350px]">
                                <CardHeader>
                                    <CardTitle>{change.title}</CardTitle>
                                    <CardDescription>{change.user.login}</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </NavBar>
    )
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
    console.log(pulls)
    return {
        props: {
            doc: {
                name
            },
            changes: pulls
        }
    }
}