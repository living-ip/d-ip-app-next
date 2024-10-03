import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/form/CreationForm";
import {useRouter} from "next/router";
import {getOwnUserProfile} from "@/lib/user";
import {convertNameToGithubRepo, fileToBase64} from "@/lib/utils";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {useState} from "react";
import {createProjectDocument, getProject} from "@/lib/project";
import {initializeStore} from "@/lib/store";
import {MainLayout} from "@/components/layouts/MainLayout";
import {useToast} from "@/components/ui/use-toast";
import {getAuthToken} from "@dynamic-labs/sdk-react-core";
import {createDocumentChange} from "@/lib/document";
import {Loader2} from "lucide-react";

export default function CreateNewDocument({project}) {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newDid, setNewDid] = useState(undefined)
	const [isCreatingChange, setIsCreatingChange] = useState(false);
	const isDocument = true;

	const {toast} = useToast()

	const onFormSubmit = async (data) => {
		console.log(data);

		if (!isDocument) {
			data.image = {
				filename: data.image[0].name,
				content: await fileToBase64(data.image[0]),
			};
			console.log(data.image);
		}

		try {
			const response = await createProjectDocument(project.pid, data, getAuthToken());
			console.log("Response: ", response);
			if (response.did) {
				setNewDid(response.did);
				setIsDialogOpen(true);
			} else {
				toast({
					title: "Error",
					description: "Failed to create document. Please contact your admin",
				})
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		router.push(`/projects/${encodeURI(project.pid)}/document/${newDid}`);
	};

	const startEdit = () => {
		setIsCreatingChange(true);
		createDocumentChange(newDid, {name: convertNameToGithubRepo("Document Creation Draft")}, getAuthToken()).then((r) => {
			console.log("Change created: ", r);
			router.push(`/projects/${encodeURI(project.pid)}/document/${newDid}/edit/${r.cid}`);
		});
	};

	return (
		<MainLayout>
			<div className="flex flex-col w-full overflow-auto items-left">
				<Card className="w-full bg-white mt-10">
					<CardContent className="mt-10 mb-4 text-4xl font-bold">
						Create New Document
					</CardContent>
					<CreationForm
						titlePlaceholder="Enter the name of your document"
						descriptionPlaceholder="Write a description about your document"
						onSubmitFunction={onFormSubmit}
						isDocument={isDocument}
					/>
				</Card>
				<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Document Creation Successful
							</AlertDialogTitle>
							<AlertDialogDescription>
								You have successfully created a new document.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogAction className={"w-1/5 bg-secondary text-secondary-foreground"} onClick={handleDialogClose}>
								{"Ok"}
							</AlertDialogAction>
							<AlertDialogAction className={"w-1/4"} onClick={startEdit}>
								{
									isCreatingChange ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin"/>
										) : (
									 <span>Start Writing</span>
									)
								}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</MainLayout>
	);
}

export const getServerSideProps = async ({req, query}) => {
	const sessionJWT = req.cookies["x_d_jwt"];
	const {userProfile, roles} = await getOwnUserProfile(sessionJWT);
	if (!userProfile) {
		return {
			redirect: {
				destination: "/onboard",
				permanent: false,
			},
		};
	}
	const zustandServerStore = initializeStore({
		user: userProfile,
	});

	const {pid} = query;
	console.log("pid: ", pid)
	const project = await getProject(pid, sessionJWT);
	console.log("Project: ", project)

	return {
		props: {
			project,
			initialZustandState: JSON.parse(
				JSON.stringify(zustandServerStore.getState())),
		},
	};
};
