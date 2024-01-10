import { Inter } from 'next/font/google'
import NavBar from '@/components/NavBar'
import { RegisterCard } from '@/components/RegisterCard'
import { authStytchRequest } from '@/lib/stytch'
import { getUserProfile } from '@/lib/server/user'
import {Container} from "@/components/ui/container";

const inter = Inter({ subsets: ['latin'] })

export default function Onboard({ user }) {
	return (
		<Container>
			<div className="flex items-center justify-center min-h-screen">
				<RegisterCard />
			</div>
		</Container>
	)
}

export const getServerSideProps = async ({ req, query }) => {
	const noAuthResponse = {
		redirect: {
			destination: '/login',
			permanent: false,
		},
	}
	try {
		// Authenticate the session JWT. If an error is thrown the session authentication has failed.
		const session = await authStytchRequest(req)
		if (!session) {
			return noAuthResponse
		}
		const { userProfile } = await getUserProfile(session.user_id)
		if (userProfile) {
			return {
				redirect: {
					destination: '/collections',
					permanent: false,
				},
			}
		}
		return {
			props: {},
		}
	} catch (e) {
		console.error(e)
		return noAuthResponse
	}
}
