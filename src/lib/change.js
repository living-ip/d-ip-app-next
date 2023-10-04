import { getCookie } from "cookies-next";

export const createChange = async (data) => {
  try {
    const response = await fetch(`/api/change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sib-token": getCookie("stytch_session_jwt"),
        "x-sib-gho-token": getCookie("gho_token"),
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
