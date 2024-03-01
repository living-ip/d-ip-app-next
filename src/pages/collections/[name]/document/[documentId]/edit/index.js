import {Button} from '@/components/ui/button'
import {useRouter} from 'next/router'
import prisma from '@/lib/server/prisma'
import {authStytchRequest} from '@/lib/stytch'
import {Label} from '@/components/ui/label'
import {useState} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from '@/components/ui/dialog'
import {createChange} from '@/lib/app/change'
import {getRepoTreeRecursive} from '@/lib/server/github'
import {getCookie} from 'cookies-next'
import {Footer} from '@/components/ui/footer'
import {Layout} from '@/components/ui/layout'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import {convertNameToGithubRepo} from "@/lib/utils";

export default function Index({collection, document, changes, chapters}) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]?.sections[0] || null)
  const [filteredStatus, setFilteredStatus] = useState('not-published')

  const newEditHandler = async () => {
    const {changeId} = await createChange({
      documentId: document.did,
      chapter: selectedChapter,
      owner: document.owner,
      repo: document.repo,
      title: editTitle,
    })
    await router.push(`/collections/${encodeURI(collection.name)}/document/${document.did}/edit/${changeId}`)
  }

  const existingEditHandler = async (changeId) => {
    await router.push(`/collections/${encodeURI(collection.name)}/document/${encodeURIComponent(document.name)}/edit/${changeId}`)
  }

  function handleChange(event) {
    const selectedSha = event.target.value
    // Find the section with the selected sha
    const selectedSection = chapters
      .flatMap((chapter) => chapter.sections)
      .find((section) => section.sha === selectedSha)

    setSelectedChapter(selectedSection)
  }

  return (
    <Layout>
      <div className="flex-1">
        <div className="my-10 text-4xl font-extrabold">{document.name}</div>
        <Label className="py-6 text-sm text-muted-foreground">Your Changes:</Label>
        <div className="mt-8 mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mx-8">New Change</Button>
            </DialogTrigger>
            <Select className="ml-2"
                    onValueChange={(value) => setFilteredStatus(value)}
                    value={filteredStatus}
            >
              <SelectTrigger className="w-[180px] mt-8">
                <SelectValue>
                  {filteredStatus === 'published' ? 'Published' : 'Not Published'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="not-published">Not Published</SelectItem>
              </SelectContent>
            </Select>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Edit</DialogTitle>
              </DialogHeader>
              <div className="mb-4">
                <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700">
                  Edit Title
                </label>
                <input type="text" id="editTitle" value={editTitle}
                  onChange={(e) => setEditTitle(convertNameToGithubRepo(e.target.value))}
                  className="block w-full p-2 mt-1 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="chapterSelect" className="block text-sm font-medium text-gray-700">
                  Select Chapter
                </label>
                <select id="chapterSelect" value={selectedChapter?.sha}
                  onChange={handleChange}
                  className="block w-full p-2 mt-1 border border-gray-300 rounded-lg"
                >
                  {chapters.flatMap((chapter) =>
                    chapter.sections.map((section) => (
                      <option key={section.sha} value={section.sha}>
                        {section.title}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <Button type="submit" className="ml-2" onClick={() => newEditHandler()}>
                Create Edit
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col h-full mb-96">
          <div className="w-full">
            {changes
              .filter((change) => {
                switch (filteredStatus) {
                  case 'published':
                    return change.published
                  case 'not-published':
                    return !change.published
                  default:
                    return true
                }
              })
              .map((change, index) => (
                <div key={index} className="py-8 border-b-2 cursor-pointer"
                     onClick={() => existingEditHandler(change.cid)}>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">{change.title}</div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-sm text-gray-600">Last Edited: {change.updatedAt}</div>
                    {change.published ? (
                      <div className="text-sm text-gray-600">Published</div>
                    ) : (
                      <div className="text-sm text-gray-600">Not Published</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
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
    },
  })
  console.log("Collection: ", collection)

  const document = await prisma.Document.findFirst({
    where: {
      did: documentId,
    },
  })
  console.log("Document: ", document)

  const {chapters} = await getRepoTreeRecursive(
    document.owner,
    document.repo
  )

  const changes = await prisma.Change.findMany({
    where: {
      suggestorId: session.user_id,
      documentId: document.did,
    },
  })

  console.log(changes)
  return {
    props: {
      collection,
      document,
      changes,
      chapters,
    },
  }
}
