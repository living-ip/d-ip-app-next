import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useStytchUser } from '@stytch/nextjs'
import Login from '@/components/simple/Login'


export default function LoginPage() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Login />
		</div>
	)
}
