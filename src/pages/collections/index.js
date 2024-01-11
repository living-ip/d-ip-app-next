import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/server/user";
import {Card, CardContent, CardDescription, CardHeader, CardImage, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Container} from "@/components/ui/container";
import {useRouter} from "next/router";
import prisma from "@/lib/server/prisma";


export default function Collections({collections}) {
  const router = useRouter()

  return (
    <Container className={"pt-24"}>
      <div className="my-10 flex justify-between items-center w-full">
        <div className={"text-4xl font-extrabold"}>Collections</div>
        <Button onClick={() => router.push(`/collections/new`)}>Create a New Collection</Button>
      </div>
      <div className="flex flex-col w-full overflow-auto mb-16">
        {collections.map((collection, index) => (
          <div key={index} className={"w-full my-2"}>
            <Card className={"flex-grow w-full"}>
              <CardHeader className={"p-0 w-full"}>
                <CardImage className={"w-full h-auto max-h-[480px] rounded-t-lg"} src={collection.image_location}/>
              </CardHeader>
              <CardContent className={"mt-4"}>
                <CardTitle className={"mb-2"}>
                  {collection.name}
                </CardTitle>
                <CardDescription className={"py-2"}>
                  {collection.description}
                </CardDescription>
                <Button
                  className={"my-2"}
                  onClick={() => router.push(`/collections/${collection.coid}`)}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  )

}


export const getServerSideProps = async ({req}) => {
  const session = await authStytchRequest(req)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  const {userProfile} = await getUserProfile(session.user_id)
  if (!userProfile) {
    return {
      redirect: {
        destination: '/onboard',
        permanent: false,
      },
    }
  }

  const collections = await prisma.Collection.findMany()
  console.log("Collections: ", collections)

  return {
    props: {
      collections,
    }
  }
}