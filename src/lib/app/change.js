import { getCookie } from "cookies-next";

export const createChange = async (data) => {
  try {
    const response = await fetch(`/api/change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sib-token": getCookie("stytch_session_jwt"),
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

export const updateChange = async (changeId, data) => {
  try {
    const base64Data = Buffer.from(data, 'utf-8').toString('base64')
    const response = await fetch(`/api/change/${changeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-sib-token': getCookie('stytch_session_jwt')
      },
      body: JSON.stringify({
        fileData: base64Data
      })
    })
    const json = await response.json();
    return json;
  } catch (e) {
    console.error(e);
    return {};
  }
}

export const submitChange = async (changeId) => {
  try {
    const response = await fetch(`/api/change/${changeId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sib-token": getCookie("stytch_session_jwt"),
      },
    });
    const json = await response.json();
    return json;
  } catch (e) {
    console.error(e);
    return {};
  }
}

export const voteOnChange = async (cid, data) => {
  try {
    const response = await fetch(`/api/change/${cid}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sib-token": getCookie("stytch_session_jwt"),
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

export const mergeChange = async (cid) => {
  try {
    const response = await fetch(`/api/change/${cid}/merge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sib-token": getCookie("stytch_session_jwt"),
      },
    });
    const json = await response.json();
    return json;
  } catch (e) {
    console.error(e);
    return {};
  }
}
