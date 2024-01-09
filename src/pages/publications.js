import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	CardImage,
} from '@/components/ui/card'
import NavBar from '@/components/NavBar'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { authStytchRequest } from '@/lib/stytch'
import { getUserProfile } from '@/lib/user'
import { Container } from '@/components/ui/container'
import { Footer } from '@/components/ui/footer'

const DocCards = ({ docs }) => {
	const router = useRouter()

	const handleTitleClick = (articleName) => {
		router.push(`/doc/${encodeURIComponent(articleName)}`)
	}

	const handleSuggestionsClick = (articleName) => {
		router.push(`/doc/${encodeURIComponent(articleName)}/vote`)
	}

	return (
		<Container>
			<NavBar />
			<h1 className="my-10 text-4xl font-extrabold">Publications</h1>
			<div className="flex flex-col h-screen">
				<div className="grid md:gap-28 sm:grid-cols-2 lg:grid-cols-3">
					{docs.map((doc, index) => (
						<div key={index}>
							<Card>
								<CardHeader>
									<CardTitle
										onClick={() =>
											handleTitleClick(doc.name)
										}
									>
										{doc.name}
									</CardTitle>
									<CardImage className={"rounded-lg"} src="/book-covers/living-book.png" />
									<CardDescription>
										{doc.description}
									</CardDescription>

									<Button
										onClick={() =>
											handleTitleClick(doc.name)
										}
									>
										Read it
									</Button>
									<Button
										variant="outline"
										onClick={() =>
											handleSuggestionsClick(doc.name)
										}
									>
										Votes
									</Button>
								</CardHeader>
							</Card>
						</div>
					))}
				</div>
			</div>
			<Footer />
		</Container>
	)
}

export default DocCards

export const getServerSideProps = async ({ req }) => {
	const session = await authStytchRequest(req)
	if (!session) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}
	const { userProfile } = await getUserProfile(session.user_id)
	if (!userProfile) {
		return {
			redirect: {
				destination: '/onboard',
				permanent: false,
			},
		}
	}
	const docs = await prisma.Document.findMany()
	console.log(docs)
	return {
		props: {
			docs,
		},
	}
}
