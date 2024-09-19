import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import { authStytchRequest } from "@/lib/stytch";
import { getProject } from "@/lib/project";
import { getDocument } from "@/lib/document";
import Image from "next/image";
import { IoArrowBackOutline } from "react-icons/io5";
import { MainLayout } from "@/components/layouts/MainLayout";
import { getUserProfile } from "@/lib/user";
import { initializeStore } from "@/lib/store";

// Dynamically import ReadingPane with SSR disabled
const ReadingPane = dynamic(() => import("@/components/doc/ReadingPane"), { ssr: false });

const Contributor = ({ src, name }) => (
  <div className="flex gap-3 py-2 mt-1 text-base leading-6">
    {src && (
      <Image src={src} alt={name} className="shrink-0 w-6 aspect-square" width="24" height="24" />
    )}
    <div>{name}</div>
  </div>
);

export default function Index({ project, document }) {
  const router = useRouter();

  const handleBack = () => router.push(`/projects/${encodeURIComponent(project.pid)}`)
  const handleVote = () => router.push(`/projects/${encodeURIComponent(project.pid)}/document/${document.did}/vote`);
  const handleEdit = () => router.push(`/projects/${encodeURIComponent(project.pid)}/document/${document.did}/edit`);

  return (
    <MainLayout>
      <main className="flex flex-row justify-between w-full bg-white rounded-3xl shadow">
        {/* Main content area */}
        <div className="w-[70%] flex flex-col h-screen">
          {/* Sticky header */}
          <div className="sticky top-0 bg-white z-10 px-5 py-8">
            <div className="flex gap-3 items-center mb-4">
              <Button
                variant="outline"
                className="p-2.5 rounded-sm border border-gray-200 border-solid"
                onClick={handleBack}
                aria-label="Go back"
              >
                <IoArrowBackOutline className="w-4 h-4" />
              </Button>
              <h1 className="text-3xl leading-9 text-neutral-950">{document.name}</h1>
            </div>
            <p className="mb-6 text-base leading-6 text-neutral-600">{document.description}</p>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5">
            <article>
              <div className="text-base text-neutral-600">
                {document.content && (
                  <ReadingPane content={Buffer.from(document.content, 'base64').toString("utf-8")} />
                )}
              </div>
            </article>
          </div>
        </div>

        {/* Sticky sidebar */}
        <div className="w-[30%] pl-6 border-l border-gray-200">
          <div className="sticky top-8 flex flex-col gap-6">
            <div className="flex flex-row gap-2 justify-start">
              <Button variant="outline">Log History</Button>
              <Button onClick={handleVote}>Vote</Button>
              <Button variant="secondary" onClick={handleEdit}>Edit</Button>
            </div>
            <div className="flex flex-col text-neutral-950">
              <h2 className="text-xl mb-4">Contributors</h2>
              {document.contributors?.map((contributor, index) => (
                <Contributor key={index} src={contributor.image_uri} name={contributor.name} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}

export const getServerSideProps = async ({ req, query }) => {
  try {
    const sessionJWT = req.cookies["x_d_jwt"];
    const { pid, documentId } = query;
    const [project, document, userProfile] = await Promise.all([
      getProject(pid, sessionJWT),
      getDocument(documentId, sessionJWT),
      getUserProfile("TODO", sessionJWT).then(response => response.userProfile)
    ]);

    if (!userProfile) {
      return {
        redirect: {
          destination: "/onboard",
          permanent: false,
        },
      };
    }

    const zustandServerStore = initializeStore({ userProfile });

    return {
      props: {
        project: project || {},
        document: document || {},
        initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        project: {},
        document: {},
        error: "An error occurred while fetching data",
      },
    };
  }
};