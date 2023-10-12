import { mergePullRequest } from "@/lib/github";
import prisma from "@/lib/prisma"
import { authStytchToken } from "@/lib/stytch"

const handler = async (req, res) => {
  if (req.method === "POST") {
    const token = req.headers["x-sib-token"];
    const session = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({error: "Unauthorized"});
    }
    const ghoToken = req.headers["x-sib-gho-token"];
    const {changeId} = req.query;
    const change = await prisma.Change.findFirst({
      where: {
        cid: changeId,
      },
    });
    const document = await prisma.Document.findFirst({
      where: {
        did: change.documentId,
      },
    });
    const ghResponse = await mergePullRequest(
      document.owner,
      document.repo,
      change.prNumber,
      ghoToken
    );
    console.log(ghResponse);
    const updatedChange = await prisma.Change.update({
      where: {
        cid: changeId,
      },
      data: {
        merged: true,
      },
    });
    console.log(updatedChange);
    return res.status(200).json(ghResponse.data);
  }
}

export default handler