import React, {useEffect, useState} from "react";
import {Layout} from "@/components/ui/layout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
// import {deleteProject, getProjectById} from "@/lib/project";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader} from "@/components/ui/dialog";
import {AlertDialog, AlertDialogContent, AlertDialogHeader} from "@/components/ui/alert-dialog";
import {authStytchRequest} from "@/lib/stytch";
// import {getUserProfile} from "@/lib/user";
import {useRouter} from "next/router";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"

export default function AdminPanel( {projects} ) {
  const router = useRouter();
  const [projectId, setProjectId] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  const [editProject, setEditProject] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState("");

  useEffect(() => {
    if (editProject) {
      fetchProjectData();
    }
  }, [editProject]);

  const fetchProjectData = async () => {
    // TODO: Write method to get project by id
    // const project = await getProjectById(editProjectId);
    // setProjectData(project);
  };

  const handleDelete = async () => {
    setShowDialog(false);
    try {
      // TODO: Method to be written
      // await deleteProject(projectId);
      console.log(`Project with id ${projectId} deleted.`);
      setAlertMessage(`Project with id ${projectId} deleted.`)
      setAlertOpen(true);
      setProjectId("");
    } catch (e) {
      console.log(e);
      setAlertMessage(`Error deleting project with id ${projectId}.`)
      setAlertOpen(true);
    }
  };

  useEffect(() => {
    if (showDialog) {
      console.log(`Fetching project name for id ${projectId}`)
      // TODO: Write method to get project by id
      // getProjectById(projectId).then((project) => {
      //   console.log(`Project name for id ${projectId} is ${project.name}`)
      //   setProjectName(project[0].name);
      // })
    }
  }, [projectId, showDialog]);

  return (
    <Layout>
      <div className="py-8 space-y-8">

        {/*Create a Project*/}
        <div className="space-y-4">
          <div className={"text-xl font-bold"}>Create Project</div>
          <div className="px-4">
            <Button onClick={() => router.push(`/projects/new`)}>
              Click here to create a new project
            </Button>
          </div>
        </div>

        {/*Edit a Project*/}
        <div className="space-y-4">
          <div className={"text-xl font-bold"}>Edit Project</div>
          <div className="px-4 space-y-2">
            <Select onValueChange={(value) => setSelectedProjectName(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a project"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {projects.map((project) => (
                    <SelectItem
                      key={project.pid}
                      value={project.name}
                    >
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="inline-flex"
                    onClick={() => router.push(`/projects/${encodeURIComponent(selectedProjectName)}/edit`)}>
              Edit Project
            </Button>
          </div>
        </div>

        {/*Delete a Project*/}
        <div className="space-y-4">
          <div className={"text-xl font-bold"}>Delete Project</div>
          <div className="px-4 space-y-2">
            <Select onValueChange={(value) => setSelectedProjectName(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a project"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {projects.map((project) => (
                    <SelectItem
                      key={project.pid}
                      value={project.name}
                    >
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="inline-flex" onClick={() => setShowDialog(true)}>Delete Project</Button>
          </div>
        </div>

        {showDialog && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogClose className="close-button" onClick={() => setShowDialog(false)}/>
              <DialogHeader>
                <h2>Confirm Deletion</h2>
              </DialogHeader>
              <DialogDescription>
                <p>Are you sure you want to delete this project: {projectName}?</p>
              </DialogDescription>
              <div className="flex justify-between w-full">
                <Button className="inline-flex" onClick={handleDelete}>Confirm</Button>
                <Button className="inline-flex" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
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

    </Layout>
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

  // TODO: Write method to get user profile
  // const {userProfile} = await getUserProfile(session.user_id, sessionJWT);
  // if (!userProfile) {
  //   return {
  //     props: {},
  //   };
  // }

  // Fetch projects
  const fetchProjects = async () => {
    // TODO: Replace with API endpoint when built
    // const data = await fetch('/api/projects');
    // return data;
    return [
      {
        pid: '1',
        name: 'Kuvera',
      }, {
        pid: '2',
        name: 'dummy project',
      }
    ];
  };

  const projects = await fetchProjects();

  return {
    props: {
      // user: userProfile,
      projects,
    },
  };
}