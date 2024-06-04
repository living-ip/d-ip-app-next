import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useStytch, useStytchUser } from '@stytch/nextjs'
import { setCookie } from 'cookies-next'
import LoadingSplash from "@/components/LoadingSplash";

const OAUTH_TOKEN = 'oauth'
const MAGIC_LINKS_TOKEN = 'magic_links'

const Authenticate = () => {
	const { user, isInitialized } = useStytchUser()
	const stytch = useStytch()
	const router = useRouter()

	useEffect(() => {
		if (stytch && !user && isInitialized) {
			const stytch_token_type =
				router?.query?.stytch_token_type?.toString()
			const token = router?.query?.token?.toString()
			if (token && stytch_token_type === OAUTH_TOKEN) {
				stytch.oauth
					.authenticate(token, {
						session_duration_minutes: 10080, // one week in minutes
					})
					.then((r) => {
						console.log('OAUTH TOKEN AUTHENTICATED')
						console.log(r)
					})
			} else if (token && stytch_token_type === MAGIC_LINKS_TOKEN) {
				stytch.magicLinks.authenticate(token, {
					session_duration_minutes: 10080, // one week in minutes
				})
			}
		}
	}, [isInitialized, router, stytch, user])

	useEffect(() => {
		if (!isInitialized) {
			console.log('Stytch not initialized')
			return
		}
		if (user) {
			router.replace('/projects')
		}
	}, [router, user, isInitialized])

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<LoadingSplash/>
			<div>Logging you in...</div>
		</div>
	);
}

export default Authenticate
