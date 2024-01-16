import {Layout} from "@/components/ui/layout";
import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/CreationForm";
import {useRouter} from "next/router";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/server/user";
import {createDocument} from "@/lib/app/document";
import {fileToBase64} from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useState} from "react";

export default function CreateNewDocument({collection}) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onFormSubmit = async (data) => {
    console.log(data);

    data.image = {
      filename: data.image[0].name,
      content: await fileToBase64(data.image[0]),
    };
    console.log(data.image);

    try {
      const response = await createDocument(collection.coid, data);
      console.log("Response: ", response);
      const documentId = response.document.did;
      console.log(documentId)
      setIsDialogOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    router.push(`/collections/${encodeURI(collection.name)}`);
  };

  return (
    <Layout childClassName={"bg-gray-100"}>
      <div className="flex flex-col w-full overflow-auto items-left min-h-screen">
        <Card className="w-full bg-white mt-10">
          <CardContent className="mt-10 mb-4 text-4xl font-bold">Request New Document Creation</CardContent>
          <CreationForm
            titlePlaceholder="Enter the name of your document"
            descriptionPlaceholder="Write a description about your document"
            onSubmitFunction={onFormSubmit}
          />
        </Card>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Document Created Successfully</AlertDialogTitle>
              <AlertDialogDescription>
                Your new document has been created. You can now view it in the collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleDialogClose}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  )
}


export const getServerSideProps = async ({req, query}) => {
  const session = await authStytchRequest(req)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  const {userProfile} = await getUserProfile(session.user_id)
  if (!userProfile) {
    return {
      redirect: {
        destination: '/onboard',
        permanent: false,
      },
    }
  }

  const {name} = query;
  console.log("Collection Name: ", name)

  const collection = await prisma.collection.findFirst({
    where: {
      name: name
    }
  })
  console.log("Collection: ", collection)

  return {
    props: {
      collection,
    },
  }
}