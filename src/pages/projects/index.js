import { authStytchRequest } from "@/lib/stytch";
import { getUserProfile } from "@/lib/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardImage,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/ui/layout";
import { useRouter } from "next/router";
import {getProjects} from "@/lib/project";

export default function Projects({ projects }) {
  const router = useRouter();

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

  return (
    <Layout>
      <div className="my-10 flex justify-between items-center w-full">
        <div className={"text-4xl font-extrabold"}>Projects</div>
      </div>
      <div className="flex flex-col w-full overflow-auto mb-8">
        {sortedProjects.map((project, index) => (
          <div key={index} className={"w-full my-8"}>
            <Card className={"flex-grow w-full"}>
              <CardHeader className={"p-0 w-full"}>
                <CardImage
                  className={"w-full h-auto max-h-[480px] rounded-t-lg"}
                  src={project.image_uri}
                />
              </CardHeader>
              <CardContent className={"mt-4"}>
                <CardTitle className={"mb-2"}>{project.name}</CardTitle>
                <CardDescription className={"py-2"}>
                  {project.description}
                </CardDescription>
                <Button
                  className={"my-2"}
                  onClick={() =>
                    router.push(
                      `/projects/${encodeURIComponent(project.pid)}`
                    )
                  }
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ req }) => {
  const { session } = await authStytchRequest(req);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const sessionJWT = req.cookies["stytch_session_jwt"];
  const { userProfile } = await getUserProfile(session.user_id, sessionJWT);
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

  return {
    props: {
      projects: projects,
    },
  };
};
