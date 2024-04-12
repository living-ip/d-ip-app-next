import {useRouter} from "next/router";
import {authStytchRequest} from "@/lib/stytch";
import {Layout} from "@/components/ui/layout";
import {getProject} from "@/lib/project";
import {getDocument, getDocumentChanges} from "@/lib/document";
import {getChangeVotes} from "@/lib/change";

export default function Index({ project, document, changesWithVotes}) {
  const router = useRouter();

  return (
    <Layout>
      <div className="flex w-full mt-8 text-4xl font-extrabold ">
        {document.name}
      </div>
      <div className="flex flex-col h-full mb-8">
        <div className="w-full">
          {changesWithVotes.map((change, index) => (
            <div
              key={index}
              className="py-8 border-b-2 cursor-pointer"
              onClick={() =>
                router.push(`/projects/${encodeURI(project.pid)}/document/${
                    document.did}/vote/${change.cid}`)}
            >
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{change.name}</div>
                <div className="text-gray-500">{change.votes.count || 0} votes</div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-sm text-gray-600">
                  Submitted by {change.creator_name}
                </div>
                <div className="text-sm text-gray-600">{change.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

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

  const {pid, documentId} = query;
  console.log("Pid: ", pid);
  console.log("Document ID: ", documentId);

  const sessionJWT = req.cookies["stytch_session_jwt"];

  const project = await getProject(pid, sessionJWT);
  console.log("Project: ", project);
  const document = await getDocument(documentId, sessionJWT);
  console.log("Document: ", document);
  const publishedChanges = await getDocumentChanges(documentId, {"published": true}, sessionJWT);
  console.log("Document Changes: ", publishedChanges);
  const changesWithVotes = await Promise.all(
    publishedChanges.map(async (change) => {
      const votes = await getChangeVotes(change.cid, {}, sessionJWT);
      return {
        ...change,
        votes,
      };
    })
  );
  console.log("Changes with Votes: ", changesWithVotes);

  return {
    props: {
      project: project,
      document: document,
      changesWithVotes: changesWithVotes,
    },
  };
};
