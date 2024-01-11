import {Container} from "@/components/ui/container";
import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/CreationForm";
import {createCollection} from "@/lib/app/collection";
import {useRouter} from "next/router";

export default function CreateNewCollection() {
  const router = useRouter();

  const onFormSubmit = async (data) => {
    data["image"] = data.image[0];
    console.log(data);
    try {
      const response = await createCollection(data);
      console.log(response);
      const collectionId = response.collection.coid;
      console.log(collectionId)
      await router.push(`/collections/${collectionId}`)
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container className={"pt-24 bg-gray-100"}>
      <div className="flex flex-col w-full overflow-auto items-left min-h-screen">
        <Card className="w-full bg-white mt-10">
          <CardContent className="mt-10 mb-4 text-4xl font-bold">Create a New Collection</CardContent>
          <CreationForm
            titlePlaceholder="Enter the name of your collection"
            descriptionPlaceholder="Write a description about your collection"
            onSubmitFunction={onFormSubmit}
          />
        </Card>
      </div>
    </Container>
  )
}