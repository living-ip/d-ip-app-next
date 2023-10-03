import prisma from "@/lib/prisma"
import {authStytchToken} from "@/lib/stytch"
import {updateGithubFile} from "@/lib/github";

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        const token = req.headers['x-sib-token'];
        const session = await authStytchToken(token)
        if (!session) {
            return res.status(401).json({error: 'Unauthorized'})
        }
        const ghoToken = req.headers['x-sib-gho-token'];
        const {changeId} = req.query;
        const {fileData} = req.body;
        const change = await prisma.Change.findFirst({
            where: {
                cid: changeId
            }
        });
        const document = await prisma.Document.findFirst({
            where: {
                did: change.documentId
            }
        });
        const ghResponse = await updateGithubFile(
            document,
            change,
            fileData,
            ghoToken
        );
        console.log(ghResponse)
        const updatedChange = await prisma.Change.update({
            where: {
                cid: changeId
            },
            data: {
                lastEditFileSha: ghResponse.data.content.sha,
            }
        })
        console.log(updatedChange)
        return res.status(201).json(ghResponse.data)
    }
}

export default handler
