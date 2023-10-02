import prisma from "@/lib/prisma";

export const getDocAndChange = async (docName, cid) => {
    const docSelect = prisma.Document.findFirst({
        where: {
            name: docName
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