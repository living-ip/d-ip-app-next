import NavBar from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Footer } from '@/components/ui/footer'
import Link from 'next/link'

export default function Lost() {
	return (
		<>
			<Container>
				<NavBar />

				<main className="grid min-h-full px-6 py-24 place-items-center sm:py-64 lg:px-8">
					<div className="text-center">
						<p className="text-base font-semibold text-slate-800">
							404
						</p>
						<h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
							Page not found
						</h1>
						<p className="mt-6 text-base leading-7 text-gray-600">
							Sorry, we couldn’t find the page you’re looking for.
						</p>
						<div className="flex items-center justify-center mt-10 gap-x-6">
							<Link href={'/'}>
								<Button variant="outline">Go back home</Button>
							</Link>
							<Link href={'#'}>
								<Button href="#" variant="solid">
									Contact us{' '}
									<span aria-hidden="true">&rarr;</span>
								</Button>
							</Link>
						</div>
					</div>
				</main>
				<Footer />
			</Container>
		</>
	)
}

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
