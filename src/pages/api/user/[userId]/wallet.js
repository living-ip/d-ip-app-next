import { default as prisma } from "@/lib/prisma";
import { authStytchToken } from "@/lib/stytch";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { MESSAGE } from "@/lib/const";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const token = req.headers["x-sib-token"];
    const session = await authStytchToken(token);
    if (!session) {
      return res.status(401).json({error: "Unauthorized"});
    }
    const {userId} = req.query;
    const {publicKey, signature} = req.body;
    if (userId !== session.user_id) {
      return res.status(403).json({error: "Forbidden"});
    }
    const user = await prisma.User.findFirst({
      where: {
        uid: session.user_id,
      }
    })
    if (user && user.walletAddress) {
      return res.status(409).json({error: "Wallet already exists"});
    }
    const verified = nacl
      .sign
      .detached
      .verify(
        new TextEncoder().encode(MESSAGE),
        bs58.decode(signature),
        bs58.decode(publicKey)
      )
    if (!verified) {
      return res.status(400).json({error: "Invalid signature"});
    }
    const updatedUser = await prisma.User.update({
      where: {
        uid: session.user_id,
      },
      data: {
        walletAddress: publicKey,
      }
    })
    console.log(updatedUser);
    return res.status(200).json({message: "Success"});
  }
}

export default handler
