import { closePullRequest, mergePullRequest } from "@/lib/server/github";
import prisma from "@/lib/server/prisma";

const handler = async (req, res) => {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }
  const changes = await prisma.Change.findMany({
    where: {
      merged: false,
      publishedAt: {
        lt: new Date(new Date() - 24 * 60 * 60 * 1000), // get changes that were published more than 24 hours ago
      }
    },
  });
  for (const change of changes) {
    const voteAggregate = await prisma.Vote.aggregate({
      where: {
        changeId: change.cid,
      },
      _sum: {
        vote: true,
      },
    })
    const document = await prisma.Document.findFirst({
      where: {
        did: change.documentId,
      },
    });
    if (voteAggregate._sum.vote < 0) { // if the change has more downvotes than upvotes, don't merge it
      const ghResponse = await closePullRequest(
        document.owner,
        document.repo,
        change.prNumber
      );
      console.log(ghResponse);
      continue;
    }
    const ghResponse = await mergePullRequest(
      document.owner,
      document.repo,
      change.prNumber
    );
    console.log(ghResponse);
    const updatedChange = await prisma.Change.update({
      where: {
        cid: change.cid,
      },
      data: {
        merged: true,
      },
    });
    console.log(updatedChange);
  }
  return res.status(200).json({changes});
}

export default handler
