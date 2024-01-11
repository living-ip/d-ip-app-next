import {Container} from "@/components/ui/container";
import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/CreationForm";
import {useRouter} from "next/router";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/server/user";
import {createDocument} from "@/lib/app/document";

export default function CreateNewDocument({collectionId}) {
  const router = useRouter();

  const onFormSubmit = async (data) => {
    data["image"] = data.image[0];
    console.log(data);
    try {
      const response = await createDocument(collectionId, data);
      console.log("Response: ", response);
      const documentId = response.document.did;
      console.log(documentId)
      await router.push(`/collections/${collectionId}/document/${documentId}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container className={"pt-24 bg-gray-100"}>
      <div className="flex flex-col w-full overflow-auto items-left min-h-screen">
        <Card className="w-full bg-white mt-10">
          <CardContent className="mt-10 mb-4 text-4xl font-bold">Create a New Document</CardContent>
          <CreationForm
            titlePlaceholder="Enter the name of your document"
            descriptionPlaceholder="Write a description about your document"
            onSubmitFunction={onFormSubmit}
          />
        </Card>
      </div>
    </Container>
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

  const {collectionId} = query;
  console.log("collectionId: ", collectionId)

  return {
    props: {
      collectionId: collectionId,
    },
  }
}