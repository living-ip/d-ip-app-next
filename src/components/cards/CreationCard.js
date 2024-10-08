import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useStore} from "@/lib/store";
import Image from "next/image";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import Link from "next/link";

export function CreationCard({creation, projectId}) {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) => [
		state.userRoles,
		state.setInvalidPermissionsDialogOpen,
	]);

	const {isAuthenticated, setShowAuthFlow} = useDynamicContext()
	const [auth, setAuth] = useState(isAuthenticated)

	useEffect(() => {
		setAuth(isAuthenticated)
	}, [isAuthenticated]);

	const openDialog = () => {
		setIsDialogOpen(true);
	};

	const closeDialog = () => {
		setIsDialogOpen(false);
	};

	const submitUserCreation = () => {
		if (!userRoles.find((role) => role.project === projectId)) {
			setInvalidPermissionsDialogOpen(true);
			return;
		}
		// TODO: Implement submission logic
		console.log("Submitting user creation");
		closeDialog();
	};

	return (
		<>
			<div
				onClick={openDialog}
				className="flex flex-col w-full cursor-pointer"
			>
				<div className="flex flex-col w-full rounded-xl border border-gray-200 border-solid overflow-hidden">
					<div className="w-full h-48 relative">
						<Image
							className="object-cover object-center"
							src={creation.media_uri || "/default-creation-image.jpg"}
							alt={creation.title}
							fill
							sizes="(max-width: 768px) 100vw, 33vw"
						/>
					</div>
					<div className="flex flex-col p-4">
						<h3 className="mb-2 text-lg font-medium leading-7 text-neutral-950 line-clamp-1">
							{creation.title}
						</h3>
						<p className="text-sm leading-5 text-neutral-600 line-clamp-3 max-h-[60px] overflow-hidden">
							{creation.description}
						</p>
					</div>
				</div>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-4xl p-0 overflow-hidden">
					<div className="w-full h-80 relative">
						<Image
							className="object-cover object-center"
							src={creation.media_uri || "/default-creation-image.jpg"}
							alt={creation.title}
							fill
							sizes="(max-width: 768px) 100vw, 66vw"
						/>
					</div>
					<div className="p-6">
						<DialogHeader>
							<DialogTitle className="text-2xl">{creation.title}</DialogTitle>
						</DialogHeader>
						<DialogDescription className="text-base mt-4">
							{creation.description}
						</DialogDescription>
						<div className="mt-6 flex justify-end">
							{
								auth ? (
									<>
										<Link href={`/projects/${projectId}/creation/${creation.creid}`}>
											<Button onClick={submitUserCreation} size="lg">Submit Yours</Button>
										</Link>
									</>
								) : (
									<Button onClick={() => {
										setShowAuthFlow(true)
									}}>Sign in to submit</Button>
								)
							}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
