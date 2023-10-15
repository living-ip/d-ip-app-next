import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'

export default function EditMenu({ saveHandler, publishHandler }) {
	const router = useRouter()
	return (
		<div className="absolute mt-[6px] mr-6 right-0 z-10 space-x-4">
			<Button
				variant="outline"
				onClick={() => {
					router.back()
				}}
			>
				Back
			</Button>
			<Button onClick={saveHandler}>Save</Button>
			<Button onClick={publishHandler}>Publish</Button>
		</div>
	)
}
