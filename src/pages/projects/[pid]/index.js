import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile, getUserRoles} from "@/lib/user";
import {Layout} from "@/components/ui/layout";
import {getProject, getProjectDocuments} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {DocumentCard} from "@/components/custom/DocumentCard";
import {NewLayout} from "@/components/NewLayout";


const ContributorBadge = ({contributorCount}) => (
  <div
    className="justify-center self-stretch px-2 py-0.5 my-auto text-xs font-medium bg-[#E1E5DE] rounded-[100px] text-neutral-950">
    {contributorCount} contributors
  </div>
);

const ProjectHeader = ({projectName, contributorCount}) => {
  const router = useRouter();

  return (
    <div className="flex gap-3 items-center">
      <div className="justify-center items-center p-2.5 my-auto rounded-sm border border-gray-200 border-solid"
        onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 aspect-square"/>
      </div>
      <h1 className="text-3xl leading-9 text-neutral-950">{projectName}</h1>
      {/*TODO: Ben - uncomment when contributorCount is returned*/}
      {/*<ContributorBadge contributorCount={contributorCount}/>*/}
    </div>
  );
}


const ProjectDescription = ({description}) => (
  <p className="mt-3 text-sm leading-5 text-neutral-600 w-[600px] max-md:max-w-full">{description}</p>
);


const DocumentCards = ({project, documents}) => {
  const router = useRouter();
  const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) =>
    [state.userRoles, state.setInvalidPermissionsDialogOpen]
  );

  console.log("Project: ", project);
  console.log("Documents: ", documents);

  const RequestNewDocCTA = () => (
    <div
      className="flex flex-col justify-center items-center self-stretch p-8 w-full rounded-xl bg-neutral-100 text-neutral-950 max-md:px-5 max-md:mt-8">
      <h2 className="text-2xl leading-8 text-center">Want more content?</h2>
      <p className="self-stretch mt-2 text-sm leading-5 text-center text-neutral-600">
        If you notice something missing, get involved and make a new document!
      </p>
      <Button
        className="justify-center px-3 py-2 mt-4 font-medium leading-6 rounded text-neutral-950 bg-[#E1E5DE]"
        onClick={() => {
          if (!userRoles.find((role) => role.project === project.pid && role.role.create_document)) {
            setInvalidPermissionsDialogOpen(true);
            return;
          }
          router.push(`/projects/${encodeURI(project.pid)}/new`);
        }}
      >
        Create New Document
      </Button>
    </div>
  );

  //TODO: Ben - Update contributorCount to correct count from API
  const contributorCount = "XX";

  return (
    <NewLayout>
      <main className="flex flex-col items-start self-center px-20 max-md:px-2 py-8 max-md:py-2 w-full bg-white rounded-3xl shadow">
        <ProjectHeader projectName={project.name} contributorCount={contributorCount}/>
        <ProjectDescription description={project.description}/>
        <div className="self-stretch mt-6 mb-14 max-md:mb-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <section className="flex flex-col w-[73%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow text-sm max-md:mt-8 max-md:max-w-full">
                <h2 className="text-xl leading-7 text-neutral-950 max-md:max-w-full">Documents</h2>
                {documents.map((document, index) => (
                  // TODO: Ben - Update lastEditDate to correct date field from API
                  <DocumentCard key={index} name={document.name}
                                description={document.description}
                                lastEditDate={document.created_at}
                                onClick={() => router.push(`/projects/${encodeURI(project.pid)}/document/${document.did}`)}
                  />
                ))}
              </div>
            </section>
            <aside className="flex flex-col ml-5 w-[27%] max-md:ml-0 max-md:w-full">
              <RequestNewDocCTA/>
            </aside>
          </div>
        </div>
      </main>
    </NewLayout>
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
  if (!project) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  const documents = await getProjectDocuments(project.pid, sessionJWT)
  console.log("Documents: ", documents);

  const userRoles = await getUserRoles(session.user_id, sessionJWT);
  console.log("User Roles: ", userRoles);

  const zustandServerStore = initializeStore({
    userProfile,
    userRoles,
    currentProject: pid,
  });

  return {
    props: {
      project: project,
      documents: documents,
      initialZustandState: JSON.parse(
        JSON.stringify(zustandServerStore.getState())
      ),
    },
  };
};
