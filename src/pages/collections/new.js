import {Layout} from "@/components/ui/layout";
import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/CreationForm";
import {createCollection} from "@/lib/app/collection";
import {useRouter} from "next/router";
import {fileToBase64} from "@/lib/utils";

// TODO: Rename mentions of Collection to Project in this function
export default function EditProject() {
  const router = useRouter();

  const onFormSubmit = async (data) => {
    console.log(data);
    data.image = {
      filename: data.image[0].name,
      content: await fileToBase64(data.image[0]),
    };
    console.log(data.image);
    try {
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
          <CardContent className="mt-10 mb-4 text-4xl font-bold">Edit a New Project</CardContent>
          <CreationForm
            titlePlaceholder="Enter the name of your project"
            descriptionPlaceholder="Write a description about your project"
            onSubmitFunction={onFormSubmit}
          />
        </Card>
      </div>
    </Layout>
  )
}