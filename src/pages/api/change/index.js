import { createDraftPullRequest } from "@/lib/github";
import { default as prisma } from "@/lib/prisma";
import { authStytchToken } from "@/lib/stytch";
import sha256 from "sha256";

const handler = async (req, res) => {
  console.log(req.body);
  if (req.method === "POST") {
    const token = req.headers["x-sib-token"];
    const session = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({error: "Unauthorized"});
    }
    const ghoToken = req.headers["x-sib-gho-token"];
    const { documentId, chapter, owner, repo, title } = req.body;
    const branchName = `${owner}/${title}`;
    const prNumber = await createDraftPullRequest(owner, repo, title, branchName, ghoToken);
    const changeId = sha256(`${owner}/${repo}/${prNumber}`);
    await prisma.Change.create({
      data: {
        cid: changeId,
        suggestorId: session.user_id,
        prNumber,
        documentId,
        title,
        published: false,
        lastEditFilePath: chapter.path,
        lastEditFileSha: chapter.sha,
        branchName,
        submit: false,
      }
    })
    return res.status(201).json({changeId});
  }
}

export default handler
