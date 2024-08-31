import {Card, CardContent} from "@/components/ui/card";
import CreateEditForm from "@/components/form/CreateEditForm";
import {useRouter} from "next/router";
import {fileToBase64} from "@/lib/utils";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile, getUserRoles} from "@/lib/user";
import {getProject, updateProject} from "@/lib/project";
import {getCookie} from "cookies-next";
import {initializeStore} from "@/lib/store";
import {MainLayout} from "@/components/layouts/MainLayout";
import {getAuthToken} from "@dynamic-labs/sdk-react-core";


export default function EditProject({project}) {
	const router = useRouter();

	const onFormSubmit = async (data) => {
		console.log(data);

		if (data.image !== project.image_uri) {
			data.image = {
				filename: data.image[0].name,
				content: await fileToBase64(data.image[0]),
			};
			console.log(data.image);
		} else {
			delete data.image;
		}
		try {
			const response = await updateProject(project.pid, data, getAuthToken());
			console.log(response);
			await router.push(`/projects/${encodeURI(project.pid)}`)
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<MainLayout>
			<div className="flex flex-col w-full overflow-auto items-left min-h-screen">
				<Card className="w-full bg-white mt-10">
					<CardContent className="mt-10 mb-4 text-4xl font-bold">Edit a Project</CardContent>
					<CreateEditForm
						formType={"project"}
						formDetails={
							{
								name: project.name,
								description: project.description,
								image_uri: project.image_uri,
							}
						}
						onSubmitFunction={onFormSubmit}
					/>
				</Card>
			</div>
		</MainLayout>
	)
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
	if (!roles.find((role) => role.project === pid && role.role.edit_project)) {
		return {
			redirect: {
				destination: `/projects/${pid}`,
				permanent: false,
			},
		};
	}
	const project = await getProject(pid, sessionJWT);

	return {
		props: {
			project: project,
			initialZustandState: JSON.parse(
				JSON.stringify(zustandServerStore.getState())),
		},
	};
}