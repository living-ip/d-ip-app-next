import {authStytchToken} from "@/lib/stytch";
import prisma from "@/lib/server/prisma";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers['x-sib-token']
    const session = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({error: 'Unauthorized'})
    }

    const {name, description, image} = req.body;

    // TODO: Process the image as needed for GCP and convert to Base64 or upload to GCP to get the URI.

    const newCollection = await prisma.Collection.create({
      data: {
        name: name,
        description: description,
        ownerId: session.user_id,
        image_uri: "image_string_holder",  //TODO: update with image URI
      }
    })

    return res.status(201).json({collection: newCollection});
  } else {
    return res.status(405).json({error: 'Method not allowed'})
  }
};

export default handler
