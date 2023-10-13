import { default as prisma } from "@/lib/prisma";
import { authStytchToken } from "@/lib/stytch";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const token = req.headers["x-sib-token"];
    const session = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({error: "Unauthorized"});
    }
    const {changeId} = req.query;
    const {vote} = req.body;
    const user = await prisma.User.findFirst({
      where: {
        uid: session.user_id,
      }
    })
    if (user && !user.walletAddress) {
      return res.status(403).json({error: "Wallet not verified"});
    }
    const voteExists = await prisma.Vote.findFirst({
      where: {
        changeId,
        voterId: session.user_id,
      }
    })
    if (voteExists) {
      await prisma.Vote.update({
        where: {
          vid: voteExists.vid,
        },
        data: {
          vote,
        }
      })
      const voteSum = await prisma.Vote.aggregate({
        where: {
            changeId: changeId
        },
        _sum: {
            vote: true
        }
      });
      console.log(voteSum);
      return res.status(200).json({voteId: voteExists.vid, totalVotes: voteSum._sum.vote || 0});
    }
    const {vid: voteId} = await prisma.Vote.create({
      data: {
        vote,
        changeId,
        voterId: session.user_id,
      }
    })
    console.log(voteId);
    const voteSum = await prisma.Vote.aggregate({
        where: {
            changeId: changeId
        },
        _sum: {
            vote: true
        }
    });
    return res.status(201).json({voteId, totalVotes: voteSum._sum.vote || 0});
  }
}

export default handler
