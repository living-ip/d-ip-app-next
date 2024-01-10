import {getCookie} from "cookies-next";

export const createUserProfile = async (data) => {
  try {
    const response = await fetch(`/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sib-token": getCookie("stytch_session_jwt"),
      },
      body: JSON.stringify(data),
    });
      return await response.json();
  } catch (e) {
    console.error(e);
    return {};
  }
};
