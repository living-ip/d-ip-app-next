import {authStytchRequest} from '@/lib/stytch'
import '@mdxeditor/editor/style.css'
import EditMenu from '@/components/edit/EditMenu'
import Editor from '@/components/edit/Editor'
import {getDocAndChange} from '@/lib/server/dbHelpers'
import {getGithubContents} from '@/lib/server/github'
import {useState} from 'react'
import {useRouter} from 'next/router'
import {submitChange, updateChange} from '@/lib/app/change'
import {Layout} from '@/components/ui/layout'

export default function Index({collection, document, change, contents}) {
  const originalDoc = Buffer.from(contents.content, 'base64').toString(
    'utf-8'
  )
  const [pageData, setPageData] = useState(originalDoc)
  const router = useRouter()

  const editorCallback = (data) => {
    setPageData(data)
  }

  const saveHandler = async () => {
    console.log('Updating Change', pageData)
    const response = await updateChange(change.cid, pageData)
    console.log(response)
    await router.push(`/collections/${encodeURI(collection.name)}/document/${document.did}`)
  }

  const publishHandler = async () => {
    const updateResponse = await updateChange(change.cid, pageData)
    if (updateResponse !== {}) {
      const response = await submitChange(change.cid)
      console.log(response)
      await router.push(`/collections/${encodeURI(collection.name)}/document/${document.did}`)
    }
  }

  return (
    <Layout>
      <div className="relative flex items-center justify-center h-screen my-24 lg:mb-12">
        <div className="relative w-full px-4 py-6 border border-gray-300 rounded-lg shadow-lg lg:w-3/4 lg:h-full">
          <EditMenu
            saveHandler={saveHandler}
            publishHandler={publishHandler}
          />
          <Editor
            markdown={originalDoc}
            onChange={editorCallback}
          />
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

  const {name, documentId, id} = query

  const collection = await prisma.Collection.findFirst({
    where: {
      name: name,
    },
  })

  const {document, change} = await getDocAndChange(documentId, id)
  console.log(document, change)
  const ghData = await getGithubContents(
    document.owner,
    document.repo,
    change.lastEditFilePath,
    change.branchName
  )
  console.log(ghData)

  return {
    props: {
      collection,
      document,
      change,
      contents: ghData,
    },
  }
}
