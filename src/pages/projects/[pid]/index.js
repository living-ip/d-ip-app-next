import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/user";
import { getProject, getProjectDocuments } from "@/lib/project";
import { initializeStore, useStore } from "@/lib/store";
import { IoArrowBackOutline } from "react-icons/io5";
import { DocumentCard } from "@/components/cards/DocumentCard";
import { CreationCard } from "@/components/cards/CreationCard";
import { NewLayout } from "@/components/NewLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjectHeader = ({ projectName, contributorCount }) => {
  const router = useRouter();

  return (
    <div className="flex gap-3 items-center">
      <Button
        variant="outline"
        className="p-2.5 rounded-sm border border-gray-200 border-solid bg-white"
        onClick={() => router.push(`/projects`)}
      >
        <IoArrowBackOutline className="w-4 h-4 cursor-pointer text-black" />
      </Button>
      <h1 className="text-3xl leading-9 text-white">{projectName}</h1>
      {/*TODO: Ben - uncomment when contributorCount is returned*/}
      {/*<ContributorBadge contributorCount={contributorCount}/>*/}
    </div>
  );
};

const ProjectDescription = ({ description }) => (
  <p className="mt-3 text-base leading-6 text-white max-md:max-w-full">{description}</p>
);

const ProjectPage = ({ project, documents, creations }) => {
  const router = useRouter();
  const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) => [
    state.userRoles,
    state.setInvalidPermissionsDialogOpen
  ]);

  if (!project || !documents) {
    console.error('Missing required props: project or documents');
    return null;
  }

  const handleCreateNewDocument = () => {
    if (!userRoles.find((role) => role.project === project.pid && role.role.create_document)) {
      setInvalidPermissionsDialogOpen(true);
      return;
    }
    router.push(`/projects/${encodeURI(project.pid)}/new`);
  };

  //TODO: Ben - Update contributorCount to correct count from API
  const contributorCount = "XX";

  return (
    <NewLayout>
      <main className="flex flex-col self-center w-full bg-white rounded-3xl shadow max-md:max-w-full">
        <section
          className="flex flex-row max-md:flex-col gap-3 justify-between max-md:justify-center w-full px-20 py-8 max-md:px-5 rounded-t-3xl"
          style={{
            backgroundImage: `url(${project.image_uri})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50 rounded-t-3xl"></div>
          <div className="relative z-10 flex flex-row max-md:flex-col gap-3 justify-between max-md:justify-center w-full rounded-t-3xl">
            <div className="flex flex-col w-[73%] max-md:w-full">
              <ProjectHeader projectName={project.name} contributorCount={contributorCount} />
              <ProjectDescription description={project.description} />
            </div>
            <div className="flex justify-end items-center gap-3 w-[27%] max-md:w-[100%] mt-24 max-md:mt-2">
              <Button variant="outline" disabled={true} className="bg-white text-black">
                Log History
              </Button>
              <Button onClick={handleCreateNewDocument}>
                Create New Document
              </Button>
            </div>
          </div>
        </section>
        <article className="mt-6 max-md:max-w-full p-4">
          <div className="hidden md:flex flex-row gap-4">
            <div className="flex flex-col w-2/3">
              <h2 className="text-xl leading-7 text-neutral-950 mb-4">Documents</h2>
              <div className="flex flex-col gap-4">
                {documents.map((document, index) => (
                  <DocumentCard
                    key={document.did || index}
                    name={document.name}
                    description={document.description}
                    lastEditDate={document.last_edit || document.created_at}
                    onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}`)}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <h2 className="text-xl leading-7 text-neutral-950 mb-4">Creations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {creations.map((creation, index) => (
                  <CreationCard
                    key={creation.did || index}
                    creation={creation}
                    projectId={project.pid}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="creations">Creations</TabsTrigger>
              </TabsList>
              <TabsContent value="documents">
                <div className="flex flex-col gap-4">
                  {documents.map((document, index) => (
                    <DocumentCard
                      key={document.did || index}
                      name={document.name}
                      description={document.description}
                      lastEditDate={document.last_edit || document.created_at}
                      onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}`)}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="creations">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {creations.map((creation, index) => (
                    <CreationCard
                      key={creation.did || index}
                      creation={creation}
                      projectId={project.pid}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </article>
      </main>
    </NewLayout>
  );
};

export default ProjectPage;

export const getServerSideProps = async ({ req, query }) => {
  const sessionJWT = req.cookies["x_d_jwt"];
  const { userProfile, roles } = await getUserProfile("TODO", sessionJWT);
  if (!userProfile) {
    return {
      redirect: {
        destination: "/onboard",
        permanent: false,
      },
    };
  }

  const { pid } = query;
  const project = await getProject(pid, sessionJWT);
  if (!project) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }
  const documents = await getProjectDocuments(project.pid, sessionJWT);
  const zustandServerStore = initializeStore({
    userProfile,
    userRoles: roles,
    currentProject: pid,
  });
  return {
    props: {
      project: project,
      documents: documents,
      creations: [{
        title: "Creation contest 1",
        description: "This is a description for creation contest 1",
        media_uri: "https://storage.googleapis.com/livingip-cdn/fa6bc265-fc63-43eb-836e-e3d7921df503-mr_bush.png"
      }],  // TODO implement backend.
      initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
    },
  };
};
