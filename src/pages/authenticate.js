import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useStytch, useStytchUser } from '@stytch/nextjs'
import { setCookie } from 'cookies-next'

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
						session_duration_minutes: 60,
					})
					.then((r) => {
						console.log('OAUTH TOKEN AUTHENTICATED')
						console.log(r)
						setCookie('gho_token', r.provider_values.access_token, {
							maxAge: 60 * 60 * 24 * 30,
						})
					})
			} else if (token && stytch_token_type === MAGIC_LINKS_TOKEN) {
				stytch.magicLinks.authenticate(token, {
					session_duration_minutes: 60,
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
			router.replace('/collections')
		}
	}, [router, user, isInitialized])

	return null
}

export default Authenticate
