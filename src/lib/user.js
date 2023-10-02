import { getCookie } from "cookies-next";
import prisma from "./prisma";

export const getUserProfile = async (userId) => {
  const user = await prisma.User.findFirst({
    where: {
      uid: userId,
    },
  });
  return { userProfile: user };
};

export const createUserProfile = async (data) => {
  try {
    const response = await fetch(`/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-stytch-token": getCookie("stytch_session_jwt"),
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;
  } catch (e) {
    console.error(e);
    return {};
  }
};
