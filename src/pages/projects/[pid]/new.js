import {Layout} from "@/components/ui/layout";
import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/CreationForm";
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

export default function CreateNewDocument({project}) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDocument = true;

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
      const response = await createProjectDocument(project.pid, data, getCookie("stytch_session_jwt"));
      console.log("Response: ", response);
      const documentId = response.did;
      console.log(documentId);
      setIsDialogOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    router.push(`/projects/${encodeURI(project.pid)}`);
  };

  return (
    <Layout childClassName={"bg-gray-100"}>
      <div className="flex flex-col w-full overflow-auto items-left min-h-screen">
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
              <AlertDialogAction onClick={handleDialogClose}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
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
