import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {deleteProject, getProjects} from "@/lib/project";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader} from "@/components/ui/dialog";
import {AlertDialog, AlertDialogContent, AlertDialogHeader} from "@/components/ui/alert-dialog";
import {authStytchRequest} from "@/lib/stytch";
import {useRouter} from "next/router";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {NewLayout} from "@/components/NewLayout";
import {getUsers} from "@/lib/user";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";

export default function AdminPanel({projects, users}) {
	const router = useRouter();
	const [projectId, setProjectId] = useState("");
	const [showDialog, setShowDialog] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const handleDelete = async () => {
		setShowDialog(false);
		try {
			await deleteProject(projectId);
			console.log(`Project with id ${projectId} deleted.`);
			setAlertMessage(`Project with id ${projectId} deleted.`);
			setAlertOpen(true);
			setProjectId("");
		} catch (e) {
			console.log(e);
			setAlertMessage(`Error deleting project with id ${projectId}.`);
			setAlertOpen(true);
		}
		router.reload();
	};
	// Function to format date from milliseconds to a readable format
	const formatDate = (milliseconds) => {
		return new Date(milliseconds).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
	return (
		<NewLayout>
			<div className="py-8 space-y-8">
				{/* Project Management Section */}
				<section>
					<h2 className="text-2xl font-bold mb-6">Project Management</h2>
					{/* Create a Project */}
					<div className="space-y-4 mb-8">
						<div className="text-xl font-bold">Create Project</div>
						<div className="px-4">
							<Button onClick={() => router.push(`/projects/new`)}>
								Click here to create a new project
							</Button>
						</div>
					</div>

					{/* Edit a Project */}
					<div className="space-y-4 mb-8">
						<div className="text-xl font-bold">Edit Project</div>
						<div className="px-4 space-y-2">
							<Select onValueChange={(value) => setProjectId(value)}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select a project"/>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{projects.map((project) => (
											<SelectItem key={project.pid} value={project.pid}>
												{project.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<Button
								className="inline-flex"
								onClick={() => router.push(`/projects/${encodeURIComponent(projectId)}/edit`)}
							>
								Edit Project
							</Button>
						</div>
					</div>

					{/* Delete a Project */}
					<div className="space-y-4">
						<div className="text-xl font-bold">Delete Project</div>
						<div className="px-4 space-y-2">
							<Select onValueChange={(value) => setProjectId(value)}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select a project"/>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{projects.map((project) => (
											<SelectItem key={project.pid} value={project.pid}>
												{project.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<Button className="inline-flex" onClick={() => setShowDialog(true)}>
								Delete Project
							</Button>
						</div>
					</div>
				</section>

				{/* User Data Table Section */}
				<section className="mt-12">
					<h2 className="text-2xl font-bold mb-6">User Data</h2>
					<Table>
						<TableCaption>A list of all current users</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Date Joined</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.uid}>
									<TableCell className="font-medium">{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{formatDate(user.created_at)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</section>

				{showDialog && (
					<Dialog open={showDialog} onOpenChange={setShowDialog}>
						<DialogContent>
							<DialogClose className="close-button" onClick={() => setShowDialog(false)}/>
							<DialogHeader>
								<h2>Confirm Deletion</h2>
							</DialogHeader>
							<DialogDescription>
								<p>
									Are you sure you want to delete this project:{" "}
									{projects.find((project) => project.pid === projectId)?.name}?
								</p>
							</DialogDescription>
							<div className="flex justify-between w-full">
								<Button className="inline-flex" onClick={handleDelete}>
									Confirm
								</Button>
								<Button className="inline-flex" variant="outline" onClick={() => setShowDialog(false)}>
									Cancel
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				)}

				{alertOpen && (
					<AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
						<AlertDialogContent className="close-button" onClick={() => setAlertOpen(false)}>
							<AlertDialogHeader>{alertMessage}</AlertDialogHeader>
						</AlertDialogContent>
					</AlertDialog>
				)}
			</div>
		</NewLayout>
	);
}
export const getServerSideProps = async ({req}) => {
	const session = await authStytchRequest(req);
	const sessionJWT = req.cookies["stytch_session_jwt"];
	if (!session || !sessionJWT) {
		return {
			props: {},
		};
	}
	const [projects, users] = await Promise.all([
		getProjects(sessionJWT),
		getUsers(sessionJWT)
	]);
	return {
		props: {
			projects,
			users,
		},
	};
};