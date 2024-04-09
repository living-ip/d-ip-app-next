import {Layout} from "@/components/ui/layout";
import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/CreationForm";
import {createCollection} from "@/lib/app/collection";
import {useRouter} from "next/router";
import {fileToBase64} from "@/lib/utils";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/server/user";

// TODO: Rename mentions of Collection to Project in this function
export default function EditCollection( {collection} ) {
  const router = useRouter();

  const onFormSubmit = async (data) => {
    console.log(data);

    if (data.image !== collection.image_uri) {
      data.image = {
        filename: data.image[0].name,
        content: await fileToBase64(data.image[0]),
      };
      console.log(data.image);
    } else {
      delete data.image;
    }
    try {
      //TODO: Update method to updateCollection
      const response = await createCollection(data);
      console.log(response);
      const collectionName = response.collection.name;
      console.log(collectionName)
      await router.push(`/collections/${encodeURI(collectionName)}`)
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout childClassName={"bg-gray-100"}>
      <div className="flex flex-col w-full overflow-auto items-left min-h-screen">
        <Card className="w-full bg-white mt-10">
          <CardContent className="mt-10 mb-4 text-4xl font-bold">Edit a Project</CardContent>
          <CreationForm
            titlePlaceholder={collection.name}
            descriptionPlaceholder={collection.description}
            onSubmitFunction={onFormSubmit}
            optionalImage={collection.image_uri}
          />
        </Card>
      </div>
    </Layout>
  )
}


export const getServerSideProps = async ({ req, query }) => {
  const { session } = await authStytchRequest(req);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { userProfile } = await getUserProfile(session.user_id);
  if (!userProfile) {
    return {
      redirect: {
        destination: "/onboard",
        permanent: false,
      },
    };
  }

  const collection = await prisma.collection.findUnique({
    where: {
      name: query.name,
    },
  });

  return {
    props: {
      collection: collection,
    },
  };
}