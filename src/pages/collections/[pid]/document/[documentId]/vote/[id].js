import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {useState} from "react";
import {authStytchRequest} from "@/lib/stytch";
import {Diff, Hunk, parseDiff} from "react-diff-view";
import "react-diff-view/style/index.css";
import {voteOnChange} from "@/lib/change";
import {Layout} from "@/components/ui/layout";
import {getProject} from "@/lib/project";
import {getDocument} from "@/lib/document";
import {getChange, getChangeVotes} from "@/lib/change";
import {getCookie} from "cookies-next";

export default function Index({ project, document, change, changeVotes, userVoteProp }) {
  const router = useRouter();
  const [totalVotes, setTotalVotes] = useState(changeVotes.count || 0);
  const [userVote, setUserVote] = useState(userVoteProp);

  const goToVotes = () => {
    router.push(`/collections/${encodeURI(project.pid)}/document/${document.did}/vote`);
  };

  const goToDocument = () => {
    router.push(`/collections/${encodeURI(project.pid)}/document/${document.did}`);
  }

  const files = parseDiff(change.diff_data);

  const renderFile = ({oldRevision, newRevision, type, hunks}) => (
    <Diff
      key={oldRevision + "-" + newRevision}
      viewType="unified"
      diffType={type}
      hunks={hunks}
    >
      {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk}/>)}
    </Diff>
  );

  const incrementVote = async () => {
    await voteOnChange(change.cid, {vote: 1}, getCookie("stytch_session_jwt"));
    if (userVoteProp === 0) {
      setTotalVotes(totalVotes + 1);
    }
    setUserVote(1);
  };

  const decrementVote = async () => {
    const result = await voteOnChange(change.cid, {vote: -1}, getCookie("stytch_session_jwt"));
    if (userVoteProp === 0) {
      setTotalVotes(totalVotes + 1);
    }
    setUserVote(-1);
  };

  return (
    <Layout>
      <div className="flex max-h-screen">
        <div className="w-1/4 pr-6 mt-10">
          <h1 className="text-4xl font-extrabold">{change.name}</h1>
          <div className="col-1 space-y-4 mt-8">
            <Button variant="outline" onClick={goToVotes}>
              Back to Changes
            </Button>
            <Button onClick={goToDocument}>
              See Document
            </Button>
          </div>
          <div className="mt-4 ml-2 text-2xl font-bold pt-4">Vote Here</div>
          <div className="py-2">
            <Button variant={userVote === -1 ? "" : "outline"} onClick={decrementVote}>
              -1
            </Button>
            <Button variant={userVote === 1 ? "" : "outline"} className="mx-8" onClick={incrementVote}>
              +1
            </Button>
          </div>
          <div className="text-xl">Total Votes: {totalVotes}</div>
        </div>
        <div className="flex-1 max-w-full max-h-screen p-4 ml-2 border-l mt-14 lg:prose-md">
          <div className="h-full px-5 -mt-6 overflow-x-scroll overflow-y-scroll">
            {files.map(renderFile)}
          </div>
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

  const {pid, documentId, id} = query;
  console.log("Pid: ", pid);
  console.log("Document ID: ", documentId);
  console.log("Change ID: ", id);

  const sessionJWT = req.cookies["stytch_session_jwt"];

  const project = await getProject(pid, sessionJWT);
  console.log("Project: ", project);
  const document = await getDocument(documentId, sessionJWT);
  console.log("Document: ", document);
  const change = await getChange(id, sessionJWT);
  console.log("Change: ", change);
  const changeVotes = await getChangeVotes(id, {"include_voters": true}, sessionJWT);
  console.log("Change Votes: ", changeVotes);
  const userVote = changeVotes.voters.find((vote) => vote.voter_id === session.user_id);
  console.log("User Vote: ", userVote);


  return {
    props: {
      project: project,
      document: document,
      change: change,
      changeVotes: changeVotes || 0,
      userVoteProp: userVote ? userVote.vote : 0,
    },
  };
};
