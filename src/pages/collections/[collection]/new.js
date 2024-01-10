import {Container} from "@/components/ui/container";
import {Card, CardContent} from "@/components/ui/card";
import CreationForm from "@/components/CreationForm";

export default function CreateNewDocument() {

  return (
    <Container className={"pt-24 bg-gray-100"}>
      <div className="flex flex-col w-full overflow-auto items-left min-h-screen">
        <Card className="w-full bg-white mt-10">
          <CardContent className="mt-10 mb-4 text-4xl font-bold">Create a New Document</CardContent>
          <CreationForm
            titlePlaceholder="Enter the name of your document"
            descriptionPlaceholder="Write a description about your document"
            onSubmitFunction={() => console.log("Submitted")}  //TODO: Update this with database write function
          />
        </Card>
      </div>
    </Container>
  )
}