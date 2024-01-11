import NavBar from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'
import ReadingPane from '@/components/doc/ReadingPane'
import UserCarousel from '@/components/ui/UserCarousel'
import ArticleCard from '@/components/ui/ArticleCard'
import prisma from '@/lib/server/prisma'
import { useState } from 'react'
import ChapterCard from '@/components/doc/ChapterCard'
import { authStytchRequest } from '@/lib/stytch'
import { getRepoTreeRecursive } from '@/lib/server/github'
import { getCookie } from 'cookies-next'
import { Container } from '@/components/ui/container'
import Image from 'next/image'
import { Footer } from '@/components/ui/footer'

export default function Index({ doc, contributors, chapters, firstPage }) {
	const router = useRouter()
	const [showChapters, setShowChapters] = useState(false)
	const [pageContent, setPageContent] = useState(firstPage)

	const goToVotes = () => {
		router.push(`/doc/${encodeURIComponent(doc.name)}/vote`)
	}

	const toggleChapters = () => {
		setShowChapters(!showChapters)
	}

	const goToEdits = () => {
		router.push(`/doc/${encodeURIComponent(doc.name)}/edit`)
	}

	return (
		<Container>
			<NavBar>
				<div className="flex">
					<div className="w-1/3 p-4 mt-8">
						<div className="flex items-center">
							{' '}
							<Image
								src={'/book-covers/living-book.png'}
								alt={'livingIP'}
								width={100}
								height={100}
								objectFit="cover"
								objectPosition="center"
								className="mr-4 rounded-lg"
							/>
							<h1 className="text-4xl font-extrabold ">
								{doc.name}
							</h1>
						</div>
						<div className="mt-8">
							<Button
								variant="outline"
								className="mr-8"
								onClick={goToVotes}
							>
								Votes
							</Button>
							<Button variant="outline" onClick={goToEdits}>
								Edit
							</Button>
							<Button className="mx-8" onClick={toggleChapters}>
								Chapters
							</Button>
						</div>
						<div className="mt-4 ml-2">
							<UserCarousel users={contributors} />
						</div>
						<ArticleCard description={doc.description} />
					</div>
					<div className="flex-1 max-h-screen p-4 ml-2 border-l">
						{showChapters ? (
							<div>
								{chapters.map((chapter, index) => {
									return (
										<ChapterCard
											key={index}
											chapter={chapter}
											setContent={setPageContent}
											showChapters={setShowChapters}
										/>
									)
								})}
							</div>
						) : (
							<div className="h-full p-4 overflow-y-scroll rounded-lg bg-gray-50">
								<ReadingPane content={pageContent} />
							</div>
						)}
					</div>
				</div>
				<Footer />
			</NavBar>
		</Container>
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
	const { chapters, firstPage } = await getRepoTreeRecursive(
		document.owner,
		document.repo,
		getCookie('gho_token')
	)
	return {
		props: {
			contributors: [
				{
					name: 'Dan Miles',
					image: 'https://pbs.twimg.com/profile_images/1702390471488659456/_bvR4h5f_400x400.jpg',
				},
				{
					name: 'm3taversal',
					image: 'https://pbs.twimg.com/profile_images/1677306057457127424/e3aHKSEs_400x400.jpg',
				},
			],
			doc: document,
			chapters,
			firstPage,
		},
	}
}
