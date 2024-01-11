import {Card, CardDescription, CardHeader, CardImage, CardTitle,} from '@/components/ui/card'
import {useRouter} from 'next/router'
import {Button} from '@/components/ui/button'
import {authStytchRequest} from '@/lib/stytch'
import {getUserProfile} from '@/lib/server/user'
import {Container} from '@/components/ui/container'

const DocCards = ({collection, docs}) => {
  const router = useRouter()

  return (
    <Container className={"pt-24"}>
      <div className="my-10 flex justify-between items-center w-full">
        <div className={"text-4xl font-extrabold"}>{collection.name}</div>
        <Button onClick={() => router.push(`/collections/${collection.name}/new`)}>Create New Document</Button>
      </div>
      <div className="flex flex-col w-full overflow-auto">
        <div className="flex flex-wrap -mx-2">
          {docs.map((doc, index) => (
            <div key={index} className={"w-full sm:w-1 md:w-1/2 lg:w-1/2 xl:w-1/3 px-2 mb-4"}>
              <Card>
                <CardHeader>
                  <CardTitle>{doc.name}</CardTitle>
                  <CardImage className={"rounded-lg"} src="/book-covers/living-book.png"/>
                  <CardDescription>{doc.description}</CardDescription>
                  <Button onClick={() => router.push(`/collections/${collection.name}/doc/${encodeURIComponent(doc.name)}`)}>
                    Read it
                  </Button>
                  <Button variant="outline" onClick={() => router.push(`/collections/${collection.name}/doc/${encodeURIComponent(doc.name)}/vote`)}>
                    See votes
                  </Button>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}

export default DocCards

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

  //TODO: get collection from db
  const collection = {
    id: "test-collection-1",
    name: "Arboreal Mystique",
    description: "‘Arboreal Mystique: Visions of Education’ delves into the enigmatic and ever-evolving world of learning, akin to the timeless growth of mystic trees. Each article serves as a leaf, contributing to the grandeur of educational discourse. As the tree’s branches reach out, seeking sunlight, so too does this collection extend towards the future, seeking enlightenment and knowledge in the field of education.",
    image_location: "/collection-covers/living-ip-cover-1.jpeg",
  }

  // const docs = [
  //   {
  //     id: 1,
  //     name: "Arboreal Mystique Part 1",
  //     description: "Something about the first article",
  //     image_location: "/book-covers/living-book.png",
  //   },
  //   {
  //     id: 2,
  //     name: "Arboreal Mystique Part 2",
  //     description: "In the second article, we talk about something else",
  //     image_location: "/book-covers/living-book.png",
  //   },
  //   {
  //     id: 3,
  //     name: "Arboreal Mystique Part 3",
  //     description: "This third article was a real stretch",
  //     image_location: "/book-covers/living-book.png",
  //   },
  //   {
  //     id: 4,
  //     name: "Arboreal Mystique Part 4",
  //     description: "The fourth article gets us back on track",
  //     image_location: "/book-covers/living-book.png",
  //   },
  //   {
  //     id: 5,
  //     name: "Arboreal Mystique Part 5",
  //     description: "The fifth article is the best one yet",
  //     image_location: "/book-covers/living-book.png",
  //   }
  // ]

  const docs = await prisma.Document.findMany()
  console.log(docs)

  return {
    props: {
      collection,
      docs,
    },
  }
}
