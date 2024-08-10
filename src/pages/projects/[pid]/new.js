import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/form/CreationForm";
import {useRouter} from "next/router";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/user";
import {fileToBase64} from "@/lib/utils";
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
import {getCookie} from "cookies-next";
import {initializeStore} from "@/lib/store";
import {NewLayout} from "@/components/NewLayout";
import {useToast} from "@/components/ui/use-toast";
import {getAuthToken} from "@dynamic-labs/sdk-react-core";

export default function CreateNewDocument({project}) {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newDid, setNewDid] = useState(undefined)
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
		setIsDialogOpen(false);
		router.push(`/projects/${encodeURI(project.pid)}/document/${newDid}/edit`);
	};

	return (
		<NewLayout>
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
							<AlertDialogAction className={"w-1/5"} onClick={handleDialogClose}>
								{"Ok"}
							</AlertDialogAction>
							<AlertDialogAction className={"w-1/4"} onClick={startEdit}>
								{"Start writing"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</NewLayout>
	);
}

export const getServerSideProps = async ({req, query}) => {
	const sessionJWT = req.cookies["x_d_jwt"];
    const { userProfile, roles } = await getUserProfile("TODO", sessionJWT);
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
