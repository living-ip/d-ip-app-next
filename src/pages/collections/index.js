import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/server/user";
import {Card, CardContent, CardDescription, CardHeader, CardImage, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Container} from "@/components/ui/container";
import {useRouter} from "next/router";


export default function Collections({collections}) {
  const router = useRouter()

  return (
    <Container className={"pt-24"}>
        <div className="mt-10 mb-4 text-4xl font-extrabold">Collections</div>
        <div className="flex flex-col w-full overflow-auto">
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
                    onClick={() => router.push(`/collections/${collection.name}`)}
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

  //TODO: get collections from db
  const collections = [
    {
      id: "test-collection-1",
      name: "Arboreal Mystique",
      description: "‘Arboreal Mystique: Visions of Education’ delves into the enigmatic and ever-evolving world of learning, akin to the timeless growth of mystic trees. Each article serves as a leaf, contributing to the grandeur of educational discourse. As the tree’s branches reach out, seeking sunlight, so too does this collection extend towards the future, seeking enlightenment and knowledge in the field of education.",
      image_location: "/collection-covers/living-ip-cover-1.jpeg",
    },
    // {
    //   id: 2,
    //   name: "Wisdom Canopy",
    //   description: "The ‘Wisdom Canopy: Roots of Tomorrow’ collection embodies the essence of educational innovation, mirroring the profound depth of roots and the expansive reach of a tree’s canopy. It's a curated assemblage of thought-provoking articles that explore the foundational roots of current educational practices and branch out into the canopy of future possibilities, reflecting the organic growth and the branching out of ideas and theories.",
    //   image_location: "/collection-covers/living-ip-cover-2.png",
    // },
    // {
    //   id: 3,
    //   name: "Chronicles of the Sapling",
    //   description: "‘Chronicles of the Sapling: Sprouting Futures’ is a visionary series that captures the budding potential of educational strategies, much like a sapling that holds the promise of a mighty tree. Each narrative within this anthology mirrors the sapling’s journey, starting from the germination of ideas to the sprouting of innovative teaching methods, all intertwined with the mystical allure of the arbor, promising growth and a canopy of future learning.",
    //   image_location: "/collection-covers/living-ip-cover-3.jpeg",
    // }
  ]
  return {
    props: {
      collections,
    }
  }
}