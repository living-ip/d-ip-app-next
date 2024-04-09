import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import ReadingPane from "@/components/doc/ReadingPane";
import UserCarousel from "@/components/ui/UserCarousel";
import {useState} from "react";
import {authStytchRequest} from "@/lib/stytch";
import {Layout} from "@/components/ui/layout";
import {getProject} from "@/lib/project";
import {getDocument} from "@/lib/document";

export default function Index({project, document, contributors, firstPage}) {
  const router = useRouter();
  const [showChapters, setShowChapters] = useState(false);

  const goToVotes = () => {
    router.push(
      `/collections/${encodeURI(project.pid)}/document/${document.did}/vote`
    );
  };

  const goToEdits = () => {
    router.push(
      `/collections/${encodeURI(project.pid)}/document/${document.did}/edit`
    );
  };

  return (
    <Layout>
      <div className="flex">
        <div className="mt-4 w-1/3">
          <div className="flex items-center">
            <div className="text-4xl font-extrabold ">{document.name}</div>
          </div>
          <div className="p-1 mt-2 text-sm italic text-gray-600">
            {document.description}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="flex">
              <Button variant="outline" className="mr-4" onClick={goToVotes}>
                Votes
              </Button>
              <Button variant="outline" onClick={goToEdits}>
                Edit
              </Button>
            </div>
          </div>
          <div className="text-2xl font-bold pt-4">Contributors</div>
          <div className="mx-2 mb-4">
            <UserCarousel users={contributors}/>
          </div>
        </div>
        <div className="flex-1 max-h-screen p-4 ml-2 border-l">
          <div className="h-full p-4 overflow-y-scroll rounded-lg bg-gray-50">
            <ReadingPane content={firstPage}/>
          </div>
        </div>
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

  const {pid, documentId} = query;
  console.log("Pid: ", pid);
  console.log("Document ID: ", documentId);

  const sessionJWT = req.cookies["stytch_session_jwt"];

  const project = await getProject(pid, sessionJWT);
  console.log("Project: ", project);
  const document = await getDocument(documentId, sessionJWT);
  console.log("Document: ", document);
  const content = document.content;
  console.log("Content: ", content);
  const decodedContent = atob(content);
  console.log("Decoded Content: ", decodedContent);

  return {
    props: {
      project: project,
      document: document,
      contributors: document.contributors,
      firstPage: decodedContent,
    },
  };
};
