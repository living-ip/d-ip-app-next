import * as React from 'react'
import {useRef, useState} from 'react'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {useRouter} from 'next/router'
import {createUserProfile} from '@/lib/user'
import {Avatar, AvatarImage} from '@/components/ui/avatar'
import {AiOutlineCamera} from 'react-icons/ai'
import {getAuthToken} from "@dynamic-labs/sdk-react-core";

export function RegisterCard() {
	const [name, setName] = useState('')
	const [avatar, setAvatar] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const fileInputRef = useRef(null)
	const router = useRouter()

	const handleAvatarChange = (event) => {
		const file = event.target.files[0]
		if (file) {
			setAvatar({
				file,
				preview: URL.createObjectURL(file)
			})
		}
	}

	const fileToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result.split(',')[1])
			reader.onerror = (error) => reject(error)
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const userDetails = {name}
			if (avatar) {
				userDetails.image = {
					filename: avatar.file.name,
					content: await fileToBase64(avatar.file),
				}
			}

			const response = await createUserProfile(userDetails, getAuthToken())
			console.log('Profile created successfully', response)
			await router.push('/projects')
		} catch (error) {
			console.error('Error creating profile:', error)
			// TODO: Add error handling UI
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Create profile</CardTitle>
				<CardDescription>Set up your account to get started</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder="Your name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-1.5">
						<Label>Profile Image</Label>
						<div className="flex flex-col items-center">
							<Avatar className="w-24 h-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
								{avatar ? (
									<AvatarImage src={avatar.preview} alt="Profile picture" className="object-cover"/>
								) : (
									<div
										className="w-full h-full rounded-full bg-gray-100 flex justify-center items-center">
										<AiOutlineCamera size={32} className="text-gray-600"/>
									</div>
								)}
							</Avatar>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="mt-2"
								onClick={() => fileInputRef.current?.click()}
							>
								{avatar ? 'Change' : 'Upload'}
							</Button>
							<input
								type="file"
								accept="image/*"
								ref={fileInputRef}
								className="hidden"
								onChange={handleAvatarChange}
							/>
						</div>
					</div>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? 'Creating...' : 'Create Profile'}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}