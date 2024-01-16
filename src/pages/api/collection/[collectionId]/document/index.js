import {authStytchToken} from "@/lib/stytch";
import {Storage} from "@google-cloud/storage";
import {uploadBase64ToGCS} from "@/lib/server/blob";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers['x-sib-token']
    const session = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({error: 'Unauthorized'})
    }

    const {title, description, image} = req.body;
    const {collectionId} = req.query;
    const imageURI = await uploadBase64ToGCS(image.content, image.filename);

    const newDocument = await prisma.Document.create({
      data: {
        name: title,
        description: description,
        owner: "tcd3",  //TODO: change this to agreed owner
        repo: "test-livingip", //TODO: change this to agreed mono-repo
        chaptersFile: "chapters.json", //TODO: make this dynamic
        collectionId: collectionId,
        image_uri: imageURI,
      }
    })

    return res.status(201).json({document: newDocument});
  } else {
    return res.status(405).json({error: 'Method not allowed'})
  }
}

export default handler
