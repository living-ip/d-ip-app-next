// TODO create a new document in this collection on a POST request.
// this requires creating a new doc in the DB, marking the owner as the requestor,
// and making a new repo for the content in github.

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
    await prisma.Document.create({
      data: {
        name: title,
        description: description,
        owner: "living-ip",  //TODO: change this to the following... owner: session.user_id,
        repo: "psyc-dao-constitution", //TODO: make this dynamic
        chaptersFile: "chapters.json", //TODO: make this dynamic
        changes: [],
        collectionID: collectionId,
        collection: {
          connect: {
            coid: collectionId,
          }
        },
        image_uri: "image_string_holder",  //TODO: take the image given and turn into base64 and store as blob in gcp
      }
    })
  }
}

export default handler
