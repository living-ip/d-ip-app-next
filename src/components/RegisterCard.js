import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'
import { createUserProfile } from '@/lib/user'

export function RegisterCard() {
	const [name, setName] = useState('')

	const router = useRouter()

	const handleSubmit = async () => {
		const response = await createUserProfile({
      name
    }, getCookie("stytch_session_jwt"));
		console.log('success', response)
		await router.push('/onboard')
	}

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Create profile</CardTitle>
				<form>
					<div className="grid items-center w-full gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
					</div>
				</form>
			</CardHeader>
			<CardFooter className="flex justify-center">
				<Button onClick={handleSubmit}>Explore</Button>
			</CardFooter>
		</Card>
	)
}
