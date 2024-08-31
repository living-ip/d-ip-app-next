import { useRouter } from "next/router";
import { getUserProfile } from "@/lib/user";
import { getProject, getProjectCreations } from "@/lib/project";
import { initializeStore } from "@/lib/store";
import { MainLayout } from "@/components/layouts/MainLayout";
import { CampaignLayout } from "@/components/layouts/CampaignLayout";
import { getCreationsCampaigns } from "@/lib/creations";

const CampaignPage = ({ project, creations, campaigns }) => {
  const router = useRouter();

  if (!project || !creations || !campaigns) {
    console.error('Missing required props: project, creations, or campaigns');
    return null;
  }

  return (
    <MainLayout>
      <main className="flex flex-col self-center w-full bg-white rounded-3xl shadow max-md:max-w-full">
        <h1 className="text-3xl font-bold p-6">{project.name} - Campaign</h1>
        <CampaignLayout 
          creations={creations} 
          projectId={project.pid} 
          campaigns={campaigns}
        />
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

  const [creationsResponse, campaignsResponse] = await Promise.all([
    getProjectCreations(project.pid, sessionJWT),
    getCreationsCampaigns(project.pid, sessionJWT)
  ]);

  const zustandServerStore = initializeStore({
    userProfile,
    userRoles: roles,
    currentProject: pid,
  });

  return {
    props: {
      project: project,
      creations: creationsResponse.creations,
      campaigns: campaignsResponse.campaigns,
      initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
    },
  };
};
