import { default as prisma } from "@/lib/server/prisma";
import { authStytchToken } from "@/lib/stytch";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const token = req.headers["x-sib-token"];
    const session = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({error: "Unauthorized"});
    }
    const {changeId} = req.query;
    const change = await prisma.Change.findFirst({
      where: {
        cid: changeId,
      },
    });
    if (change.suggestorId !== session.user_id) {
      return res.status(401).json({error: "Unauthorized"});
    }
    const updatedChange = await prisma.Change.update({
      where: {
        cid: changeId,
      },
      data: {
        published: true,
        publishedAt: new Date(),
      },
    });
    console.log(updatedChange);
    return res.status(201).json(updatedChange);
  }
}

export default handler
