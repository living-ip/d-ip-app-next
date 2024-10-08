import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/form/CreationForm";
import {useRouter} from "next/router";
import {fileToBase64} from "@/lib/utils";
import {getCookie} from "cookies-next";
import {createProject} from "@/lib/project";
import {MainLayout} from "@/components/layouts/MainLayout";
import {useToast} from "@/components/ui/use-toast";
import {getAuthToken} from "@dynamic-labs/sdk-react-core";


export default function CreateNewProject() {
	const router = useRouter();
	const {toast} = useToast()

	const onFormSubmit = async (data) => {
		console.log(data);

		data.image = {
			filename: data.image[0].name,
			content: await fileToBase64(data.image[0]),
		};
		console.log(data.image);
		try {
			const response = await createProject(data, getAuthToken());
			console.log(response);
			if (response.pid) {
				toast({
					title: "Success",
					description: "Project created",
				})
				await router.push(`/projects/${encodeURI(response.pid)}`)
			} else {
				toast({
					title: "Error",
					description: "Failed to create project",
				})
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<MainLayout>
			<div className="flex flex-col w-full overflow-auto items-left">
				<Card className="w-full bg-white mt-10">
					<CardContent className="mt-10 mb-4 text-4xl font-bold">Create a New Project</CardContent>
					<CreationForm
						titlePlaceholder="Enter the name of your project"
						descriptionPlaceholder="Write a description about your project"
						onSubmitFunction={onFormSubmit}
					/>
				</Card>
			</div>
		</MainLayout>
	)
}