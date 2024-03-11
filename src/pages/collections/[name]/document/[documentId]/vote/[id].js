import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import UserCarousel from "@/components/ui/UserCarousel";
import ArticleCard from "@/components/ui/ArticleCard";
import prisma from "@/lib/server/prisma";
import { useState } from "react";
import { authStytchRequest } from "@/lib/stytch";
import { getPullRequestData } from "@/lib/server/github";
import { Diff, Hunk, parseDiff } from "react-diff-view";

import "react-diff-view/style/index.css";
import { mergeChange, voteOnChange } from "@/lib/app/change";
import { Layout } from "@/components/ui/layout";
import { Footer } from "@/components/ui/footer";

export default function Index({
  collection,
  doc,
  contributors,
  cid,
  ghData,
  votes,
  userVoteProp,
}) {
  const router = useRouter();
  const [showChapters, setShowChapters] = useState(false);
  const [totalVotes, setTotalVotes] = useState(votes || 0);
  const [userVote, setUserVote] = useState(userVoteProp);

  console.log(ghData);

  const goToVotes = () => {
    router.push(
      `/collections/${encodeURI(collection.name)}/document/${doc.did}/vote`
    );
  };

  const toggleChapters = () => {
    router.push(`/doc/${encodeURIComponent(doc.did)}`);
  };

  const files = parseDiff(ghData.diffData);

  const renderFile = ({ oldRevision, newRevision, type, hunks }) => (
    <Diff
      key={oldRevision + "-" + newRevision}
      viewType="unified"
      diffType={type}
      hunks={hunks}
    >
      {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
    </Diff>
  );

  const incrementVote = async () => {
    const result = await voteOnChange(cid, { vote: 1 });
    setTotalVotes(result.totalVotes);
    setUserVote(1);
  };

  const decrementVote = async () => {
    const result = await voteOnChange(cid, { vote: -1 });
    setTotalVotes(result.totalVotes);
    setUserVote(-1);
  };

  const merge = async () => {
    const result = await mergeChange(cid);
    console.log(result);
    router.push(`/doc/${encodeURIComponent(doc.name)}`);
  };

  return (
    <Layout>
      <div className="flex max-h-screen">
        <div className="w-1/4 pr-6 mt-10">
          <h1 className="text-4xl font-extrabold">{ghData.response.title}</h1>
          <div className="mt-8">
            <Button variant="outline" className="mr-0" onClick={goToVotes}>
              Votes
            </Button>
            <Button className="mx-8" onClick={goToVotes}>
              Back to Reading
            </Button>
          </div>
          <div className="mt-4 ml-2">
            <div className="text-2xl font-bold pt-4">Contributors</div>
            <UserCarousel users={contributors} />
          </div>
          <div className="my-10">
            <Button
              variant={userVote === -1 ? "" : "outline"}
              onClick={decrementVote}
            >
              -1
            </Button>
            <Button
              variant={userVote === 1 ? "" : "outline"}
              className="mx-8"
              onClick={incrementVote}
            >
              +1
            </Button>
            Votes: {totalVotes}
          </div>
          {totalVotes > 3 && (
            <div className="mt-4">
              <Button variant="outline" className="mx-2" onClick={merge}>
                Merge
              </Button>
            </div>
          )}
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

export const getServerSideProps = async ({ req, query }) => {
  const { session } = await authStytchRequest(req);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { name, documentId, id } = query;

  const collection = await prisma.Collection.findFirst({
    where: {
      name: name,
    },
  });
  console.log(collection);

  const data = await prisma.Document.findFirst({
    where: {
      did: documentId,
    },
  });
  console.log(data);

  const changeData = await prisma.Change.findFirst({
    where: {
      cid: id,
    },
    include: {
      suggestor: true,
    },
  });
  console.log(changeData);

  const voteAggregate = await prisma.Vote.aggregate({
    where: {
      changeId: id,
    },
    _sum: {
      vote: true,
    },
  });
  console.log(voteAggregate);

  const userVote = await prisma.Vote.findFirst({
    where: {
      changeId: id,
      voterId: session.user_id,
    },
  });
  console.log(userVote);

  const ghData = await getPullRequestData(
    data.owner,
    data.repo,
    changeData.prNumber
  );
  console.log(ghData);

  const proposerName = changeData.suggestor.name;
  const votes = await prisma.Vote.findMany({
    include: {
      voter: true,
    },
  });
  const voters = votes.map((vote) => vote.voter.name);
  const allNames = [proposerName, ...voters];
  const contributors = [...new Set(allNames)];

  return {
    props: {
      collection,
      contributors,
      doc: data,
      cid: id,
      ghData,
      votes: voteAggregate._sum.vote || 0,
      userVoteProp: userVote ? userVote.vote : 0,
    },
  };
};
