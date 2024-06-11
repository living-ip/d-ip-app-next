import {Card, CardContent} from "@/components/ui/card";
import CreateEditForm from "@/components/CreateEditForm";
import {useRouter} from "next/router";
import {fileToBase64} from "@/lib/utils";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile, getUserRoles} from "@/lib/user";
import {getProject, updateProject} from "@/lib/project";
import {getCookie} from "cookies-next";
import {initializeStore} from "@/lib/store";
import {NewLayout} from "@/components/NewLayout";


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
			const response = await updateProject(project.pid, data, getCookie("stytch_session_jwt"));
			console.log(response);
			await router.push(`/projects/${encodeURI(project.pid)}`)
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<NewLayout>
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
		</NewLayout>
	)
}


export const getServerSideProps = async ({req, query}) => {
	const {session} = await authStytchRequest(req);
	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}
	const sessionJWT = req.cookies["stytch_session_jwt"];
	const {userProfile} = await getUserProfile(session.user_id, sessionJWT);
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
	const userRoles = await getUserRoles(session.user_id, sessionJWT);
	console.log("User Roles: ", userRoles);
	if (!userRoles.find((role) => role.project === pid && role.role.edit_project)) {
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