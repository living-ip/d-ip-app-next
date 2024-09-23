import { useState } from "react";
import { parseDiff } from "react-diff-view";
import { useRouter } from "next/router";
import { IoArrowBackOutline } from "react-icons/io5";
import { useStore } from "@/lib/store";
import { getChange, getChangeVotes } from "@/lib/change";
import { getProject } from "@/lib/project";
import { getDocument } from "@/lib/document";
import { getUserProfile } from "@/lib/user";
import { MainLayout } from "@/components/layouts/MainLayout";
import { VotingForm } from "@/components/vote/VotingForm";
import { VotePageBadge } from "@/components/badge/VotePageBadge";
import { ResultsCard } from "@/components/cards/ResultsCard";
import { AwaitResults } from "@/components/vote/AwaitResults";
import { Button } from "@/components/ui/button";
import VoteTimeRemainingBadge from "@/components/badge/VoteTimeRemainingBadge";

import DiffFile from '@/components/diff/DiffFile';

export default function Index({ project, document, change, changeVotes, userVoteProp, initialUserRoles }) {
  const router = useRouter();
  const { userRoles, setInvalidPermissionsDialogOpen } = useStore((state) => ({
    userRoles: state.userRoles,
    setInvalidPermissionsDialogOpen: state.setInvalidPermissionsDialogOpen,
  }));
  const [userVote, setUserVote] = useState(userVoteProp);

  useEffect(() => {
    useStore.setState({ userRoles: initialUserRoles });
  }, [initialUserRoles]);

  const files = parseDiff(change.diff_data);
  const voteTimeLeft = change.vote_timeout - Date.now();

  const userCanVote = useCallback(() => {
    const canVote = userRoles.some((role) => role.project === project.pid && role.role.vote_on_change);
    if (!canVote) {
      setInvalidPermissionsDialogOpen(true);
    }
    return canVote;
  }, [userRoles, project.pid, setInvalidPermissionsDialogOpen]);

  const ResultsSection = () => (
    <>
      <h2 className="mt-4 text-lg px-5 font-semibold">Results</h2>
      <AwaitResults />
    </>
  );

  return (
    <MainLayout>
      <div className="flex flex-col justify-center pb-6 bg-neutral-100">
        <main className="flex flex-col items-start p-8 w-full bg-white rounded-3xl shadow-md max-md:px-5">
          <div className="flex gap-3 items-center flex-wrap">
            <Button
              variant="outline"
              className="p-2.5 rounded-sm border border-gray-200"
              onClick={() => router.push(`/projects/${router.query.pid}/document/${router.query.documentId}`)}
            >
              <IoArrowBackOutline className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold leading-9 text-neutral-950">{document.name}</h1>
          </div>
          <div className="flex mt-2 space-x-2 flex-wrap">
            {voteTimeLeft && voteTimeLeft > 0 ? (
              <>
                <VotePageBadge>Voting Ongoing</VotePageBadge>
                <VoteTimeRemainingBadge change={change} />
              </>
            ) : (
              <VotePageBadge>Closed</VotePageBadge>
            )}
          </div>
          <p className="mt-2 text-sm text-neutral-600 w-full max-w-3xl">{change.description}</p>
          <section className="mt-7 mb-10 w-full">
            <div className="flex gap-5 flex-col lg:flex-row">
              <article className="w-full lg:w-2/3">
                <div className="max-h-screen overflow-y-auto">
                  {files && files.map((file, index) => (
                    <DiffFile key={index} {...file} />
                  ))}
                </div>
              </article>
              <aside className="w-full lg:w-1/3">
                {change.closed || change.merged ? (
                  <ResultsCard change={change} changeVotes={changeVotes} />
                ) : userCanVote() ? (
                  <>
                    <VotingForm change={change} userVote={userVote} setUserVote={setUserVote} />
                    <ResultsSection />
                  </>
                ) : (
                  <ResultsSection />
                )}
              </aside>
            </div>
          </section>
        </main>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps = async ({ req, query }) => {
  const { pid, documentId, id } = query;
  const sessionJWT = req.cookies["x_d_jwt"];

  try {
    const [project, document, change, changeVotes, { userProfile, roles }] = await Promise.all([
      getProject(pid, sessionJWT),
      getDocument(documentId, sessionJWT),
      getChange(id, sessionJWT),
      getChangeVotes(id, { "include_voters": true }, sessionJWT),
      getUserProfile("TODO", sessionJWT),
    ]);

    if (!project || !document || !change) {
      return {
        redirect: {
          destination: `/projects/${pid}/document/${documentId}`,
          permanent: false,
        },
      };
    }

    const userVote = changeVotes.voters.find((vote) => vote.voter_id === userProfile.uid);

    const zustandServerStore = initializeStore({
      userProfile,
      userRoles: roles,
      currentProject: pid,
    });

    return {
      props: {
        project,
        document,
        change,
        changeVotes: changeVotes || {},
        userVoteProp: userVote ? userVote.vote : 0,
        initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
        // This is still not ideal. We'll improve it further in the next step.
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};
