import {authStytchRequest} from "@/lib/stytch";
import {getUserProfile, getUserRoles} from "@/lib/user";
import {Layout} from "@/components/ui/layout";
import {useRouter} from "next/router";
import {getProjects} from "@/lib/project";
import {initializeStore, useStore} from "@/lib/store";
import {YourProjectCard} from "@/components/custom/YourProjectCard";
import {OtherProjectCard} from "@/components/custom/OtherProjectCard";

export default function Projects({projects}) {
  const router = useRouter();
  const [userRoles, setInvalidPermissionsDialogOpen] = useStore((state) =>
    [state.userRoles, state.setInvalidPermissionsDialogOpen]
  );

  const desiredOrder = [
    "Claynosaurz",
    "Renaissance Hackathon Demo",
    "Build Republic",
    "LivingIP",
    "LivingIP Product"
  ];

  const sortedProjects = [...projects].sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.name);
    const indexB = desiredOrder.indexOf(b.name);

    if (indexA === -1 && indexB === -1) {
      return 0;
    } else if (indexA === -1) {
      return 1;
    } else if (indexB === -1) {
      return -1;
    } else {
      return indexA - indexB;
    }
  });

  //TODO: YourProjects and OtherProjects should be fetched from the backend
  const yourProjects = sortedProjects;
  const otherProjects = [
    {
      name: "Build Republic",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      members: 32,
      articles: 14,
      lastEdit: "14 April 2024",
      image_uri: "/collection-covers/living-ip-cover-1.jpeg",
    },
    {
      name: "Kuvera",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      members: 32,
      articles: 14,
      lastEdit: "14 April 2024",
      image_uri: "/collection-covers/living-ip-cover-3.jpeg",
    },
  ];

  return (
    <Layout>
      <main
        className="flex flex-col self-center px-20 py-8 w-full bg-white rounded-3xl shadow max-w-[1392px] max-md:px-5 max-md:max-w-full">
        <h1 className="text-3xl leading-9 text-neutral-950 max-md:max-w-full">Projects</h1>
        <h2 className="mt-6 text-xl leading-7 text-neutral-950 max-md:max-w-full">Your projects</h2>
        <div className="mt-4 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            {yourProjects.map((project, index) => (
              <YourProjectCard key={index} project={project}/>
            ))}
          </div>
        </div>
        <h2 className="mt-6 text-xl leading-7 text-neutral-950 max-md:max-w-full">Other projects</h2>
        {otherProjects.map((project, index) => (
          <OtherProjectCard key={index} project={project}/>
        ))}
      </main>
    </Layout>
  );
}

export const getServerSideProps = async ({req}) => {
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

  const projects = await getProjects(sessionJWT);
  console.log("Projects: ", projects);

  const userRoles = await getUserRoles(session.user_id, sessionJWT);
  console.log("User Roles: ", userRoles);

  const zustandServerStore = initializeStore({
    userProfile,
    userRoles,
    currentProject: undefined,
  });

  return {
    props: {
      projects,
      initialZustandState: JSON.parse(
        JSON.stringify(zustandServerStore.getState())
      ),
    },
  };
};
