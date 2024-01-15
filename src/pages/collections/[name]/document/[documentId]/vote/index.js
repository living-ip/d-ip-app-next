import {Button} from '@/components/ui/button'
import {useRouter} from 'next/router'
import prisma from '@/lib/server/prisma'
import {getRepoPulls} from '@/lib/server/github'
import {authStytchRequest} from '@/lib/stytch'
import sha256 from 'sha256'
import {Layout} from '@/components/ui/layout'

export default function Index({collection, document, changes}) {
  const router = useRouter()

  return (
    <Layout>
      <div className={"flex justify-between items-center w-full"}>
        <div className="mt-8 text-4xl font-extrabold ">{document.name}</div>
        <Button variant="outline" className="mt-8" onClick={() => router.back()}>Back</Button>
      </div>
      <div className="flex flex-col h-full mb-4">
        <div className="w-full">
          {changes.map((change, index) => (
            <div key={index} className="py-8 border-b-2"
                 onClick={() => router.push(`/collections/${encodeURI(collection.name)}/document/${document.did}/vote/${changeId}`)}>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{change.title}</div>
                <div className="text-gray-500">{change.votes || 0} votes</div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-sm text-gray-600">Submitted by {change.user.login}</div>
                <div className="text-sm text-gray-600">{change.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

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

  const {name, documentId} = query

  const collection = await prisma.Collection.findFirst({
    where: {
      name: name,
    }
  })
  console.log("Collection: ", collection)

  const document = await prisma.Document.findFirst({
    where: {
      did: documentId,
    },
  })
  console.log("Document: ", document)

  const pulls = await getRepoPulls(
    document.owner,
    document.repo,
    req.cookies['gho_token']
  )

  const changeIds = pulls.map((pull) => {
    return sha256(`${pull.head.repo.full_name}/${pull.number}`)
  })

  const publishedChanges = await prisma.Change.findMany({
    where: {
      cid: {
        in: changeIds,
      },
      published: true,
    },
  })
  console.log(publishedChanges)

  const changesWithVotes = await Promise.all(
    publishedChanges.map(async (change) => {
      const voteSum = await prisma.Vote.aggregate({
        where: {
          changeId: change.cid,
        },
        _sum: {
          vote: true,
        },
      })

      return {
        ...change,
        votes: voteSum._sum.vote || 0,
      }
    })
  )

  const pullsWithVoteData = pulls
    .map((pull) => {
      const changeId = sha256(
        `${pull.head.repo.full_name}/${pull.number}`
      )
      const changeData = changesWithVotes.find(
        (change) => change.cid === changeId
      )
      if (changeData) {
        return {
          ...pull,
          votes: changeData ? changeData.votes : 0,
          changeId,
        }
      }
      return null
    })
    .filter((pull) => pull !== null)
  console.log(pullsWithVoteData)

  return {
    props: {
      collection,
      document,
      changes: pullsWithVoteData,
    },
  }
}
