import {default as prisma} from "@/lib/server/prisma";
import {authStytchToken} from "@/lib/stytch";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const token = req.headers["x-sib-token"];
    const {session} = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({error: "Unauthorized"});
    }
    const {changeId} = req.query;
    const {vote} = req.body;
    const voteExists = await prisma.Vote.findFirst({
      where: {
        changeId,
        voterId: session.user_id,
      },
    });
    if (voteExists) {
      await prisma.Vote.update({
        where: {
          vid: voteExists.vid,
        },
        data: {
          vote,
        },
      });
      const totalVotes = await prisma.Vote.count({
        where: {
          changeId: changeId,
        }
      });
      console.log(totalVotes);
      return res
        .status(200)
        .json({voteId: voteExists.vid, totalVotes: totalVotes || 0});
    }
    const {vid: voteId} = await prisma.Vote.create({
      data: {
        vote,
        changeId,
        voterId: session.user_id,
      },
    });
    console.log(voteId);
    const totalVotes = await prisma.Vote.count({
      where: {
        changeId: changeId,
      }
    });
    console.log(totalVotes);
    return res.status(201).json({voteId, totalVotes: totalVotes || 0});
  }
};

export default handler;
