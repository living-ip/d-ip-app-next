import {Layout} from "@/components/ui/layout";
import {Card, CardContent} from "@/components/ui/card";
import CreateEditForm from "@/components/CreateEditForm";
import {useRouter} from "next/router";
import {fileToBase64} from "@/lib/utils";
import {getCookie} from "cookies-next";
import {createProject} from "@/lib/project";


export default function NewProject() {
  const router = useRouter();

  const onFormSubmit = async (data) => {
    console.log(data);
    data.image = {
      filename: data.image[0].name,
      content: await fileToBase64(data.image[0]),
    };
    console.log(data.image);
    try {
      const response = await createProject(data, getCookie("stytch_session_jwt"));
      console.log(response);
      await router.push(`/collections/${encodeURI(response.pid)}`)
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout childClassName={"bg-gray-100"}>
      <div className="flex flex-col w-full overflow-auto items-left min-h-screen">
        <Card className="w-full bg-white mt-10">
          <CardContent className="mt-10 mb-4 text-4xl font-bold">Create a New Project</CardContent>
          <CreateEditForm
            formType={"project"}
            onSubmitFunction={onFormSubmit}
          />
        </Card>
      </div>
    </Layout>
  )
}