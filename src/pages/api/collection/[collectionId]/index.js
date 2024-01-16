import {authStytchToken} from "@/lib/stytch";
import {uploadBase64ToGCS} from "@/lib/server/blob";

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const token = req.headers['x-sib-token'];
    const session = await authStytchToken(token)
    if (!session) {
      return res.status(401).json({error: 'Unauthorized'})
    }

    const {collectionId} = req.query;
    const {title, description, image} = req.body;
    const imageURI = await uploadBase64ToGCS(image.content, image.filename);

    const updateCollection = await prisma.Collection.update({
      where: {
        coid: collectionId
      },
      data: {
        name: title,
        description: description,
        image_uri: imageURI,
      }
    })
    console.log("Collection Update: ", updateCollection)

    return res.status(201).json({collection: updateCollection})
  } else {
    return res.status(405).json({error: 'Method not allowed'})
  }
}

export default handler