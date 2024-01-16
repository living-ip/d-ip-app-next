import {authStytchToken} from "@/lib/stytch";
import prisma from "@/lib/server/prisma";

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const token = req.headers['x-sib-token'];
    const session = await authStytchToken(token)
    if (!session) {
      return res.status(401).json({error: 'Unauthorized'})
    }

    const {documentId} = req.query;
    const updateDocument = await prisma.Document.update({
      where: {
        did: documentId
      },
      data: {
        draft: false,
      }
    })
    console.log("Document Update: ", updateDocument)

    return res.status(201).json({document: updateDocument})
  } else {
    return res.status(405).json({error: 'Method not allowed'})
  }
}

export default handler