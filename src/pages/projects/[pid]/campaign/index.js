import { useRouter } from "next/router";
import { getOwnUserProfile } from "@/lib/user";
import { getProject } from "@/lib/project";
import {getCreationsCampaigns, getProjectCreations} from "@/lib/creations";
import { initializeStore } from "@/lib/store";
import { MainLayout } from "@/components/layouts/MainLayout";
import { CampaignLayout } from "@/components/layouts/CampaignLayout";
import { Button } from "@/components/ui/button";
import { IoArrowBackOutline } from "react-icons/io5";

const CampaignPage = ({ project, creations, campaigns }) => {
  const router = useRouter();

  if (!project || !creations || !campaigns) {
    console.error('Missing required props: project, creations, or campaigns');
    return null;
  }

  return (
    <MainLayout>
      <main className="flex flex-col h-screen">
        <div className="flex items-center gap-4 p-6">
          <Button
            variant="outline"
            className="p-2.5 rounded-sm border border-gray-200 border-solid bg-white"
            onClick={() => router.push(`/projects/${project.pid}`)}
          >
            <IoArrowBackOutline className="w-4 h-4 cursor-pointer text-black"/>
          </Button>
          <h1 className="text-3xl font-bold">{project.name}</h1>
        </div>
        <div className="flex-grow overflow-hidden">
          <CampaignLayout 
            creations={creations} 
            projectId={project.pid} 
            campaigns={campaigns}
          />
        </div>
      </main>
    </MainLayout>
  );
};

export default CampaignPage;

export const getServerSideProps = async ({ req, query }) => {
  const sessionJWT = req.cookies["x_d_jwt"];
  const { userProfile, roles } = await getOwnUserProfile(sessionJWT);
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
