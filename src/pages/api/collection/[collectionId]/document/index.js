import { authStytchToken } from "@/lib/stytch";
import prisma from "@/lib/server/prisma";
import { uploadBase64ToGCS } from "@/lib/server/blob";
import { v4 as uuidv4 } from "uuid";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const token = req.headers["x-sib-token"];
    const { session } = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, description, image } = req.body;
    const { collectionId } = req.query;
    const imageURI = await uploadBase64ToGCS(
      image.content,
      `${uuidv4()}-${image.filename}`
    );

    const newDocument = await prisma.Document.create({
      data: {
        name: title,
        description: description,
        owner: "living-ip",
        repo: title.split(" ").join("-").toLowerCase(),
        chaptersFile: "chapters.json", //TODO: make this dynamic
        collectionId: collectionId,
        image_uri: imageURI,
      },
    });

    return res.status(201).json({ document: newDocument });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
