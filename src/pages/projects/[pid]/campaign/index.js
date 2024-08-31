import { useRouter } from "next/router";
import { getUserProfile } from "@/lib/user";
import { getProject, getProjectCreations } from "@/lib/project";
import { initializeStore } from "@/lib/store";
import { MainLayout } from "@/components/layouts/MainLayout";
import { CampaignLayout } from "@/components/layouts/CampaignLayout";

const CampaignPage = ({ project, creations }) => {
  const router = useRouter();

  if (!project || !creations) {
    console.error('Missing required props: project or creations');
    return null;
  }

  return (
    <MainLayout>
      <main className="flex flex-col self-center w-full bg-white rounded-3xl shadow max-md:max-w-full">
        <CampaignLayout creations={creations} projectId={project.pid} />
      </main>
    </MainLayout>
  );
};

export default CampaignPage;

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
  const creationsResponse = await getProjectCreations(project.pid, sessionJWT);
  const zustandServerStore = initializeStore({
    userProfile,
    userRoles: roles,
    currentProject: pid,
  });
  return {
    props: {
      project: project,
      creations: creationsResponse.creations,
      initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
    },
  };
};
