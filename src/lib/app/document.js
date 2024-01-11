import {getCookie} from "cookies-next";

export const createDocument = async (collectionId, data) => {
  try {
    const response = await fetch(`/api/collections/${collectionId}/document`, {
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
}