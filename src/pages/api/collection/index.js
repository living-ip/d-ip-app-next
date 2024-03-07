import {authStytchToken} from "@/lib/stytch";
import prisma from "@/lib/server/prisma";
import {uploadBase64ToGCS} from "@/lib/server/blob";
import { v4 as uuidv4 } from 'uuid';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers['x-sib-token']
    const session = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({error: 'Unauthorized'})
    }

    const {title, description, image} = req.body;
    const imageURI = await uploadBase64ToGCS(image.content, `${uuidv4()}-${image.filename}`);

    const newCollection = await prisma.Collection.create({
      data: {
        name: title,
        description: description,
        ownerId: session.user_id,
        image_uri: imageURI,
      }
    })

    return res.status(201).json({collection: newCollection});
  } else {
    return res.status(405).json({error: 'Method not allowed'})
  }
};

export default handler
