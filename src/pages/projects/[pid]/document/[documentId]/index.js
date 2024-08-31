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
      <main className="flex flex-col self-center px-20 py-8 w-full bg-white rounded-3xl shadow max-md:px-5">
        <section className="flex flex-row max-md:flex-col gap-3 justify-between w-full">
          <div className="flex flex-col w-[73%] max-md:w-full">
            <div className="flex gap-3 max-md:flex-wrap">
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
            <p className="mt-3 text-base leading-6 text-neutral-600">{document.description}</p>
          </div>
          <div className="flex justify-end items-center gap-3 w-[27%] max-md:w-full mt-24 max-md:mt-2">
            <Button variant="outline" disabled>Log History</Button>
            <Button onClick={handleVote}>Vote</Button>
            <Button variant="secondary" onClick={handleEdit}>Edit</Button>
          </div>
        </section>
        <article className="mt-6">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[73%] max-md:w-full">
              <div className="text-base text-neutral-600 h-full overflow-y-auto">
                {document.content && (
                  <ReadingPane content={Buffer.from(document.content, 'base64').toString("utf-8")} />
                )}
              </div>
            </div>
            <aside className="flex flex-col ml-5 w-[27%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow text-neutral-950 max-md:mt-8">
                <h2 className="text-xl">Contributors</h2>
                {document.contributors?.map((contributor, index) => (
                  <Contributor key={index} src={contributor.image_uri} name={contributor.name} />
                ))}
              </div>
            </aside>
          </div>
        </article>
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