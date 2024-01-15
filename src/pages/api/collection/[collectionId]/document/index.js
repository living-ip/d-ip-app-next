import {authStytchToken} from "@/lib/stytch";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers['x-sib-token']
    const session = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({error: 'Unauthorized'})
    }

    const {title, description, image} = req.body;
    const {collectionId} = req.query;

    // TODO: Process the image as needed for GCP and convert to Base64 or upload to GCP to get the URI.

    const newDocument = await prisma.Document.create({
      data: {
        name: title,
        description: description,
        owner: "living-ip",  //TODO: change this to the following... owner: session.user_id,
        repo: "psyc-dao-constitution", //TODO: make this dynamic
        chaptersFile: "chapters.json", //TODO: make this dynamic
        collectionId: collectionId,
        image_uri: "image_string_holder",  //TODO: update with image URI
      }
    })

    return res.status(201).json({document: newDocument});
  } else {
    return res.status(405).json({error: 'Method not allowed'})
  }
}

export default handler
