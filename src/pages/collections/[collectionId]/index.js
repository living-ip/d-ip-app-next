import {Card, CardDescription, CardHeader, CardImage, CardTitle,} from '@/components/ui/card'
import {useRouter} from 'next/router'
import {Button} from '@/components/ui/button'
import {authStytchRequest} from '@/lib/stytch'
import {getUserProfile} from '@/lib/server/user'
import {Container} from '@/components/ui/container'
import prisma from "@/lib/server/prisma";

const DocCards = ({collection, docs}) => {
  const router = useRouter()

  return (
    <Container className={"pt-24"}>
      <div className="my-10 flex justify-between items-center w-full">
        <div className="flex flex-col mr-4 w-full">
          <div className={"flex mb-4 justify-between items-center w-full"}>
            <div className={"text-4xl font-extrabold"}>{collection.name}</div>
            <Button onClick={() => router.push(`/collections/${collection.coid}/new`)}>Create New Document</Button>
          </div>
          <div className={"text-lg"}>{collection.description}</div>
        </div>
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
                  <Button onClick={() => router.push(`/collections/${collection.coid}/document/${encodeURIComponent(doc.did)}`)}>
                    Read it
                  </Button>
                  <Button variant="outline" onClick={() => router.push(`/collections/${collection.coid}/document/${encodeURIComponent(doc.did)}/vote`)}>
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

export const getServerSideProps = async ({req, query}) => {
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

  const {collectionId} = query
  const collection = await prisma.Collection.findFirst({
    where: {
      coid: collectionId,
    },
  })
  console.log("Collection: ", collection)

  const docs = await prisma.Document.findMany({
    where: {
      collectionId: collectionId,
    },
  })
  console.log("Documents: ", docs)

  return {
    props: {
      collection,
      docs,
    },
  }
}
