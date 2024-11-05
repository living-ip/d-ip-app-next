// ChatSheet.jsx
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import ProjectChat from "@/components/chat/ProjectChat";
import {Separator} from "@/components/ui/separator";
import { useMediaQuery } from 'usehooks-ts'

export default function ChatSheet({children, title = "AI Chat"}) {
	const isMobile = useMediaQuery('(max-width: 768px)')
	
	if (isMobile) {
		return (
			<>
				<Sheet>
					<SheetTrigger asChild>{children}</SheetTrigger>
					<SheetContent
						side="bottom"
						className="h-[calc(100vh-5rem)]"
					>
						<SheetHeader>
							<SheetTitle>{title}</SheetTitle>
							<Separator/>
						</SheetHeader>
						<div className="h-[calc(100vh-10rem)] overflow-hidden pt-2">
							<ProjectChat/>
						</div>
					</SheetContent>
				</Sheet>
			</>
		)
	}

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent
				side="right"
				className="w-full sm:!w-1/2 max-w-lg"
				style={{
					width: 'calc(100% * (1/2))',
					maxWidth: '720px',
					minWidth: '300px'
				}}
			>
				<SheetHeader>
					<SheetTitle>{title}</SheetTitle>
					<Separator />
				</SheetHeader>
				<div className="h-[calc(100vh-5rem)] overflow-hidden my-4">
					<ProjectChat/>
				</div>
			</SheetContent>
		</Sheet>
	)
}
