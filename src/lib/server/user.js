import prisma from "./prisma";

export const getUserProfile = async (userId) => {
    const user = await prisma.User.findFirst({
        where: {
            uid: userId,
        },
    });
    return {userProfile: user};
};

