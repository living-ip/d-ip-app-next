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
      return res.status(200).json({voteId: voteExists.vid});
    }
    const {vid: voteId} = await prisma.Vote.create({
      data: {
        vote,
        changeId,
        voterId: session.user_id,
      }
    })
    console.log(voteId);
    return res.status(201).json({voteId});
  }
}

export default handler
