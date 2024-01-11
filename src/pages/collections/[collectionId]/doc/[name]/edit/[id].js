import NavBar from '@/components/NavBar'
import { authStytchRequest } from '@/lib/stytch'
import '@mdxeditor/editor/style.css'
import EditMenu from '@/components/edit/EditMenu'
import Editor from '@/components/edit/Editor'
import { getDocAndChange } from '@/lib/server/dbHelpers'
import { getGithubContents, updateGithubFile } from '@/lib/server/github'
import { useState } from 'react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { submitChange, updateChange } from '@/lib/app/change'
import { Container } from '@/components/ui/container'
import { Footer } from '@/components/ui/footer'

export default function Index({ doc, change, contents }) {
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
		router.push(`/doc/${encodeURIComponent(doc.name)}`)
	}

	const publishHandler = async () => {
		const response = await submitChange(change.cid)
		console.log(response)
		router.push(`/doc/${encodeURIComponent(doc.name)}`)
	}

	return (
		<>
			<Container>
				<NavBar />
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
				<Footer />
			</Container>
		</>
	)
}

export const getServerSideProps = async ({ req, query }) => {
	const session = await authStytchRequest(req)
	if (!session) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}
	const { name, id } = query
	const { document, change } = await getDocAndChange(name, id)
	console.log(document, change)
	const ghData = await getGithubContents(
		document.owner,
		document.repo,
		change.lastEditFilePath,
		change.branchName,
		req.cookies['gho_token']
	)
	console.log(ghData)
	return {
		props: {
			doc: document,
			change,
			contents: ghData,
		},
	}
}
