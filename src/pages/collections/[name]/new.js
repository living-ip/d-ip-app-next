import {Layout} from "@/components/ui/layout";
import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/CreationForm";
import {useRouter} from "next/router";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/server/user";
import {createDocument} from "@/lib/app/document";
import {fileToBase64} from "@/lib/utils";

export default function CreateNewDocument({collection}) {
  const router = useRouter();

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
      await router.push(`/collections/${encodeURI(collection.name)}/document/${documentId}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout childClassName={"bg-gray-100"}>
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