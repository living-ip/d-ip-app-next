import {authStytchToken} from "@/lib/stytch";

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const token = req.headers['x-sib-token'];
    const session = await authStytchToken(token)
    if (!session) {
      return res.status(401).json({error: 'Unauthorized'})
    }

    const {collectionId} = req.query;
    const {title, description, image} = req.body;

    // TODO: Process the image as needed for GCP and convert to Base64 or upload to GCP to get the URI.

    const updateCollection = await prisma.Collection.update({
      where: {
        coid: collectionId
      },
      data: {
        name: title,
        description: description,
        image_uri: "image_string_holder",  //TODO: update with image URI
      }
    })
    console.log("Collection Update: ", updateCollection)

    return res.status(201).json({collection: updateCollection})
  }
}

export default handler