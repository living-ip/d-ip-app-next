import prisma from "@/lib/prisma"
import { authStytchToken } from "@/lib/stytch"

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers['x-stytch-token']
    const session = await authStytchToken(token)
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const user = await prisma.User.findFirst({
      where: {
        uid: session.user_id,
      },
    })
    if (user) {
      return res.status(409).json({ error: 'User already exists' })
    }
    const { name } = req.body
    await prisma.User.create({
      data: {
        uid: session.user_id,
        email: "missing@example.com",
        name,
      },
    })
    return res.status(201).json({ message: 'Success' })
  }
}

export default handler
