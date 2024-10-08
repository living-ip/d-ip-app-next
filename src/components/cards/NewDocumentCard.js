import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/form/CreationForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useRouter} from "next/router";
import {useState} from "react";
import {fileToBase64} from "@/lib/utils";
import {createProjectDocument} from "@/lib/project";
import {getCookie} from "cookies-next";
import {getAuthToken} from "@dynamic-labs/sdk-react-core";


export function NewDocumentCard({project}) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDocument = true;
  const [documentId, setDocumentId] = useState("");

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
      const documentId = response.did;
      setDocumentId(documentId);
      console.log(documentId);
      setIsDialogOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-auto items-left">
      <Card className="w-full border-0">
        <CardContent className="px-0 pb-6 text-3xl font-bold">
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
            <AlertDialogAction onClick={() => {
              setIsDialogOpen(false);
              router.push(`/projects/${encodeURI(project.pid)}/document/${encodeURI(documentId)}`);
            }}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}