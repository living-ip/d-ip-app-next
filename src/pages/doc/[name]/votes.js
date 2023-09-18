import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";

export default function Index({article, changes}) {

    const router = useRouter();

    const onClick = () => {
        router.push(`/doc/${article.name}`)
    }

    return (
        <NavBar>
            <h1 className="text-4xl font-extrabold m-1 pl-2">{article.name}</h1>
            <div>
                <Button variant="secondary" className="ml-2" onClick={onClick}>Back</Button>
            </div>
            <div className="flex flex-col h-full mb-4 p-6">
                <div className="md:grid md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                    {changes.map((article, index) => (
                        <div key={index} onClick={() => handleClick(article.name)}>
                            <Card className="w-[350px]">
                                <CardHeader>
                                    <CardTitle>{article.name}</CardTitle>
                                    <CardDescription>{article.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </NavBar>
    )
}

export const getServerSideProps = async (context) => {
    const {name} = context.query
    return {
        props: {
            article: {
                name
            },
            changes: [
                {name: "Edit paragprah 1 syntax", description: "Changed the syntax of paragraph 1 to be more readable"},
            ]
        }
    }
}