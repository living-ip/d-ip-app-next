import React, {useState} from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useStore} from "@/lib/store";
import {Button} from "@/components/ui/button";
import {IoIosArrowRoundBack} from "react-icons/io";
import {useRouter} from "next/router";
import {Loader2} from "lucide-react";

export function EditChangeLayout({children, publishHandler, saveHandler}) {
	const router = useRouter();
	const [invalidPermissionsDialogOpen, setInvalidPermissionsDialogOpen] = useStore((state) =>
		[state.invalidPermissionsDialogOpen, state.setInvalidPermissionsDialogOpen]
	);

	const [loading, setLoading] = useState(false)

	const handleDialogClose = () => {
		setInvalidPermissionsDialogOpen(false);
	}

	const publishWrapper = async () => {
		setLoading(true)
		await publishHandler()
	}

	const saveWrapper = async () => {
		setLoading(true);
		await saveHandler()
	}


	return (
		<div className="flex flex-col pb-6 bg-neutral-100 h-screen px-8">
			<div className="flex flex-row justify-between items-center pt-4">
				<Button variant="ghost" onClick={() => {
					saveWrapper()
					router.push(`/projects/${router.query.pid}/document/${router.query.documentId}/edit`)
				}}>
					<IoIosArrowRoundBack className="w-4 h-4"/>
					Back
				</Button>
				<div className="justify-center items-center space-x-2">
					{
						loading ? (
							<Button className={"bg-[#245D00]"} disabled>
								<Loader2 className="mr-2 h-4 w-4 animate-spin"/>
								Please Wait
							</Button>
						) : (
							<>
								<Button className="bg-[#E1E5DE] text-[#0A0A0A]" variant="outline"
								        onClick={saveWrapper}>Save</Button>
								<Button onClick={publishWrapper}>Publish</Button>
							</>
						)
					}

				</div>
			</div>
			{children}
			<AlertDialog open={invalidPermissionsDialogOpen} onOpenChange={handleDialogClose}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Invalid Permissions
						</AlertDialogTitle>
						<AlertDialogDescription>
							You do not have permissions to perform this action.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={handleDialogClose}>
							OK
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
