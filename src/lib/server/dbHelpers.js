import prisma from "@/lib/server/prisma";

export const getDocAndChange = async (documentId, cid) => {
    const docSelect = prisma.Document.findFirst({
        where: {
            did: documentId
        }
    })
    const changeSelect = prisma.Change.findFirst({
        where: {
            cid: cid
        }
    })
    return {
        document: await docSelect || {},
        change: await changeSelect || {}
    }
}