import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import prisma from "@/lib/prisma";
import {authStytchRequest} from "@/lib/stytch";
import { getUserProfile } from "@/lib/user";

const DocCards = ({docs}) => {
    const router = useRouter();

    const handleTitleClick = (articleName) => {
        router.push(`/doc/${encodeURIComponent(articleName)}`);
    };

    const handleSuggestionsClick = (articleName) => {
        router.push(`/doc/${encodeURIComponent(articleName)}/vote`);
    }

    return (
        <NavBar>
            <h1 className="text-4xl font-extrabold m-1 pl-2">Discover</h1>
            <div className="flex flex-col h-full mb-4 p-6">
                <div className="md:grid md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                    {docs.map((doc, index) => (
                        <div key={index}>
                            <Card>
                                <CardHeader>
                                    <CardTitle onClick={() => handleTitleClick(doc.name)}>{doc.name}</CardTitle>
                                    <CardDescription>Be right with you</CardDescription>
                                    <Button onClick={() => handleTitleClick(doc.name)}>Read it</Button>
                                    <Button variant="outline"
                                            onClick={() => handleSuggestionsClick(doc.name)}>Votes</Button>
                                </CardHeader>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </NavBar>
    );
};

export default DocCards;

export const getServerSideProps = async ({req}) => {
    const session = await authStytchRequest(req)
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    const { userProfile } = await getUserProfile(session.user_id)
    if (!userProfile) {
        return {
            redirect: {
                destination: "/onboard",
                permanent: false,
            },
        };
    }
    const docs = await prisma.Document.findMany();
    console.log(docs)
    return {
        props: {
            docs
        }
    }
}
