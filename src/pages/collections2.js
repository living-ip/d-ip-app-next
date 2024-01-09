import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/user";
import NavBar from "@/components/NavBar";
import {Card, CardContent, CardDescription, CardHeader, CardImage, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Footer} from "@/components/ui/footer";
import {Container} from "@/components/ui/container";
import {useRouter} from "next/router";


export default function Collections2({collections}) {
  const router = useRouter()

  const handleTitleClick = (collectionName) => {
    console.log(collectionName)
    // router.push(`/doc/${encodeURIComponent(articleName)}`)
  }

  return (
    <Container>
      <div className="fixed top-0 mx-auto w-full pb-2 sm:pb-4 lg:pb-8 z-10 bg-white">
        <NavBar/>
      </div>
      <div className={"pt-16"}>
        <div className="mt-10 mb-4 text-4xl font-extrabold">Collections</div>
        <div className="flex flex-col w-full overflow-auto">
          {collections.map((collection, index) => (
            <div key={index} className={"w-full my-2"}>
              <Card className={"flex-grow w-full"}>
                <CardHeader className={"p-0 w-full"}>
                  <CardImage className={"w-full h-auto max-h-[480px] rounded-t-lg"} src={collection.image_location}/>
                </CardHeader>
                <CardContent className={"mt-4"}>
                  <CardTitle className={"mb-2"} onClick={() => handleTitleClick(collection.name)}>
                    {collection.name}
                  </CardTitle>
                  <CardDescription className={"py-2"}>
                    {collection.description}
                  </CardDescription>
                  <div className={"flex justify-between py-2"}>
                    <Button onClick={() => handleTitleClick(collection.name)}>
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Footer className="fixed bottom-0 w-full"/>
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
  const collections = [
    {
      id: 1,
      name: "Arboreal Mystique: Visions of Education",
      description: "‘Arboreal Mystique: Visions of Education’ delves into the enigmatic and ever-evolving world of learning, akin to the timeless growth of mystic trees. Each article serves as a leaf, contributing to the grandeur of educational discourse. As the tree’s branches reach out, seeking sunlight, so too does this collection extend towards the future, seeking enlightenment and knowledge in the field of education.",
      image_location: "/collection-covers/living-ip-cover-1.jpeg",
    },
    {
      id: 2,
      name: "Wisdom Canopy: Roots of Tomorrow",
      description: "The ‘Wisdom Canopy: Roots of Tomorrow’ collection embodies the essence of educational innovation, mirroring the profound depth of roots and the expansive reach of a tree’s canopy. It's a curated assemblage of thought-provoking articles that explore the foundational roots of current educational practices and branch out into the canopy of future possibilities, reflecting the organic growth and the branching out of ideas and theories.",
      image_location: "/collection-covers/living-ip-cover-2.png",
    },
    {
      id: 3,
      name: "Chronicles of the Sapling: Sprouting Futures",
      description: "‘Chronicles of the Sapling: Sprouting Futures’ is a visionary series that captures the budding potential of educational strategies, much like a sapling that holds the promise of a mighty tree. Each narrative within this anthology mirrors the sapling’s journey, starting from the germination of ideas to the sprouting of innovative teaching methods, all intertwined with the mystical allure of the arbor, promising growth and a canopy of future learning.",
      image_location: "/collection-covers/living-ip-cover-3.jpeg",
    }
  ]
  return {
    props: {
      collections,
    }
  }
}