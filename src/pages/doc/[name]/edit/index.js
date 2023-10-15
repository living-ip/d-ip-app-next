import NavBar from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'
import prisma from '@/lib/prisma'
import { authStytchRequest } from '@/lib/stytch'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { createChange } from '@/lib/change'
import { getRepoTreeRecursive } from '@/lib/github'
import { getCookie } from 'cookies-next'
import { Footer } from '@/components/ui/footer'
import { Container } from '@/components/ui/container'
import {
	Select,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select'

export default function Index({ doc, changes, chapters }) {
	const router = useRouter()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editTitle, setEditTitle] = useState('')
	const [selectedChapter, setSelectedChapter] = useState(
		chapters[0]?.sections[0] || null
	)
	const [filteredStatus, setFilteredStatus] = useState('not-published')

	const onClick = () => {
		router.back()
	}

	const newEditHandler = async () => {
		const { changeId } = await createChange({
			documentId: doc.did,
			chapter: selectedChapter,
			owner: doc.owner,
			repo: doc.repo,
			title: editTitle,
		})
		router.push(`/doc/${encodeURIComponent(doc.name)}/edit/${changeId}`)
	}

	const existingEditHandler = (changeId) => {
		router.push(`/doc/${encodeURIComponent(doc.name)}/edit/${changeId}`)
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
		<>
			<Container>
				<NavBar />
				<main className="flex-1">
					<h1 className="my-10 text-4xl font-extrabold">
						{doc.name}
					</h1>
					<Label className="py-6 text-sm text-muted-foreground">
						Your Changes:
					</Label>
					<div className="mt-8 mb-4">
						<Button variant="outline" onClick={onClick}>
							Back
						</Button>
						<Dialog>
							<DialogTrigger asChild>
								<Button className="mx-8">New Change</Button>
							</DialogTrigger>
							<Select
								className="ml-2"
								onValueChange={(value) =>
									setFilteredStatus(value)
								}
								value={filteredStatus}
							>
								<SelectTrigger className="w-[180px] mt-8">
									<SelectValue>
										{filteredStatus === 'published'
											? 'Published'
											: 'Not Published'}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="published">
										Published
									</SelectItem>
									<SelectItem value="not-published">
										Not Published
									</SelectItem>
								</SelectContent>
							</Select>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Create a New Edit</DialogTitle>
								</DialogHeader>
								<div className="mb-4">
									<label
										htmlFor="editTitle"
										className="block text-sm font-medium text-gray-700"
									>
										Edit Title
									</label>
									<input
										type="text"
										id="editTitle"
										value={editTitle}
										onChange={(e) =>
											setEditTitle(e.target.value)
										}
										className="block w-full p-2 mt-1 border border-gray-300 rounded-lg"
									/>
								</div>
								<div className="mb-4">
									<label
										htmlFor="chapterSelect"
										className="block text-sm font-medium text-gray-700"
									>
										Select Chapter
									</label>
									<select
										id="chapterSelect"
										value={selectedChapter?.sha}
										onChange={handleChange}
										className="block w-full p-2 mt-1 border border-gray-300 rounded-lg"
									>
										{chapters.flatMap((chapter) =>
											chapter.sections.map((section) => (
												<option
													key={section.sha}
													value={section.sha}
												>
													{section.title}
												</option>
											))
										)}
									</select>
								</div>
								<Button
									type="submit"
									className="ml-2"
									onClick={() => newEditHandler()}
								>
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
									<div
										key={index}
										onClick={() =>
											existingEditHandler(change.cid)
										}
										className="py-8 border-b-2 cursor-pointer"
									>
										<div className="flex items-center justify-between">
											<h2 className="text-xl font-bold">
												{change.title}
											</h2>
										</div>
										<div className="flex justify-between mt-2">
											<div className="text-sm text-gray-600">
												Last Edited: {change.updatedAt}
											</div>
											{change.published ? (
												<div className="text-sm text-gray-600">
													Published
												</div>
											) : (
												<div className="text-sm text-gray-600">
													Not Published
												</div>
											)}
										</div>
									</div>
								))}
						</div>
					</div>
					<Footer />
				</main>
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
	const { name } = query
	const document = await prisma.Document.findFirst({
		where: {
			name: name,
		},
	})
	const { chapters } = await getRepoTreeRecursive(
		document.owner,
		document.repo,
		getCookie('gho_token')
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
			doc: document,
			changes,
			chapters,
		},
	}
}
