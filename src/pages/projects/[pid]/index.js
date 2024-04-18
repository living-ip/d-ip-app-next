import {Card, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile} from "@/lib/user";
import {Layout} from "@/components/ui/layout";
import {convertNameToGithubRepo} from "@/lib/utils";
import {getProject, getProjectDocuments} from "@/lib/project";

const DocumentCards = ({project, documents, adminUser}) => {
  const router = useRouter();

  return (
    <Layout>
      <div className="my-10 flex justify-between items-center w-full">
        <div className="flex flex-col mr-4 w-full">
          <div className={"flex mb-4 justify-between items-center w-full"}>
            <div className={"text-4xl font-extrabold"}>{project.name}</div>
            <Button onClick={() => router.push(`/projects/${encodeURI(project.pid)}/new`)}>
              Create New Document
            </Button>
          </div>
          <div className={"text-lg"}>{project.description}</div>
        </div>
      </div>
      <div className="flex flex-col w-full overflow-auto mb-16">
        <div className="flex flex-wrap -mx-2">
          {documents.map((document, index) => {
            const cardStyle = document.draft ? "bg-gray-200 no-shadow" : "";
            const titleStyle = document.draft ? "text-gray-500 italic" : "";
            const imageStyle = document.draft ? "blur-sm" : "";
            const documentName = document.draft ? "Document Under Review" : document.name;
            const documentDescription = document.draft
              ? "This document is currently under review by the community. Please check back later."
              : document.description;
            return (
              <div
                key={index}
                className={`w-full sm:w-1 md:w-1/2 lg:w-1/2 xl:w-1/3 px-2 mb-8`}
              >
                <Card className={cardStyle}>
                  <CardHeader>
                    <CardTitle className={titleStyle}>{documentName}</CardTitle>
                    {adminUser && document.draft ? (
                      <div className="text-sm text-gray-500">
                        Name of repo to be created:{" "}
                        {convertNameToGithubRepo(document.name)}
                      </div>
                    ) : null}
                    <div className="flex flex-col justify-between h-full">
                      <CardDescription>{documentDescription}</CardDescription>
                      <div className="flex justify-between mt-auto">
                        {document.draft ? (
                          adminUser ? (
                            <Button
                              // onClick={() => { approveDocument(project.coid, document.did).then((r) => router.push(`/projects/${encodeURI(project.pid)}`))}}
                            >
                              Approve Draft
                            </Button>
                          ) : null
                        ) : (
                          <>
                            <Button onClick={() =>
                              router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}`)}>
                              Read it
                            </Button>
                            <Button variant="outline"
                                    onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}/vote`)}>
                              See Changes
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default DocumentCards;

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
  const sessionJWT = req.cookies["stytch_session_jwt"];
  const {userProfile} = await getUserProfile(session.user_id, sessionJWT);
  if (!userProfile) {
    return {
      redirect: {
        destination: "/onboard",
        permanent: false,
      },
    };
  }

  const {pid} = query;
  console.log("pid: ", pid)
  const project = await getProject(pid, sessionJWT);
  console.log("Project: ", project)

  const documents = await getProjectDocuments(project.pid, sessionJWT)
  console.log("Documents: ", documents);

  //TODO: Remove this once roles and permissions have been implemented
  let adminUser = false;
  if (session.user_id === "user-test-af0ae6be-d4cb-400c-8ba1-31be8876d8db") {
    adminUser = true;
  }

  return {
    props: {
      project: project,
      documents: documents,
      adminUser: adminUser,
    },
  };
};
