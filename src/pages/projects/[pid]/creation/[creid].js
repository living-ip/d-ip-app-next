import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import {getUserProfile} from "@/lib/user";
import {getProject} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";
import {IoArrowBackOutline} from "react-icons/io5";
import {NewLayout} from "@/components/NewLayout";
import {createSubmission, getProjectCreation, getUserSubmission} from "@/lib/creations";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/Editor"), {ssr: false});

const CreationRequestHeader = ({creationRequest}) => {
	const router = useRouter();

	return (
		<div className="flex gap-3 items-center">
			<Button
				variant="outline"
				className="p-2.5 rounded-sm border border-gray-200 border-solid bg-white"
				onClick={() => router.push(`/projects`)}
			>
				<IoArrowBackOutline className="w-4 h-4 cursor-pointer text-black"/>
			</Button>
			<h1 className="text-3xl leading-9 text-white">{creationRequest.title}</h1>
		</div>
	);
};

const CreationRequestPage = ({creationRequest, submission, content}) => {
	return (
		<NewLayout>
			<main className="flex flex-col self-center w-full bg-white rounded-3xl shadow max-md:max-w-full">
				<section
					className="flex flex-row max-md:flex-col gap-3 justify-between max-md:justify-center w-full px-20 py-8 max-md:px-5 rounded-t-3xl"
					style={{
						backgroundImage: `url(${creationRequest.media_uri})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						position: 'relative',
					}}
				>
					<div className="absolute inset-0 bg-black opacity-50 rounded-t-3xl"></div>
					<div
						className="relative z-10 flex flex-row max-md:flex-col gap-3 justify-between max-md:justify-center w-full rounded-t-3xl">
						<div className="flex flex-col w-[73%] max-md:w-full">
							<CreationRequestHeader creationRequest={creationRequest}/>
							<p className="mt-3 text-base leading-6 text-white max-md:max-w-full">{creationRequest.description}</p>
						</div>
					</div>
				</section>
				<article className="mt-6 max-md:max-w-full p-4">
					<div className="flex flex-row gap-4">
						<div className="flex flex-col w-full">
							<Editor creation={submission} content={content}/>
						</div>
					</div>
				</article>
			</main>
		</NewLayout>
	);
};

export default CreationRequestPage;

export const getServerSideProps = async ({req, query}) => {
	const sessionJWT = req.cookies["x_d_jwt"];
	const {userProfile, roles} = await getUserProfile("TODO", sessionJWT);
	if (!userProfile) {
		return {
			redirect: {
				destination: "/onboard",
				permanent: false,
			},
		};
	}

	const {pid, creid} = query;
	const project = await getProject(pid, sessionJWT);
	if (!project) {
		return {
			redirect: {
				destination: "/projects",
				permanent: false,
			},
		};
	}
	let [creation, submission] = await Promise.all([
		getProjectCreation(project.pid, creid),
		getUserSubmission(project.pid, creid, sessionJWT),
	])
	const zustandServerStore = initializeStore({
		userProfile,
		userRoles: roles,
		currentProject: pid,
	});
	if (submission.submission) {
		const bucketData = await fetch(submission.submission.uri);
		const content = await bucketData.text();
		return {
			props: {
				creationRequest: creation.creation,
				submission: submission.submission || {},
				content: content || "",
				initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
			},
		};
	} else {
		submission = await createSubmission(project.pid, creid, sessionJWT);
		return {
			props: {
				creationRequest: creation.creation,
				submission: submission.submission || {},
				content: "",
				initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
			},
		};
	}
};
