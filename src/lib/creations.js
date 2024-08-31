import { LIP_API_BASE } from "./constants";
import { doApiCall } from "./api";
import {getAuthToken} from "@dynamic-labs/sdk-react-core";

export async function getProjectCreations(pid, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/creation/`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
  });
  const response = await doApiCall(func, {creations: []});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function getProjectCreation(pid, creid) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/creation/${creid}/`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await doApiCall(func, {creation: {}});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function getCreationSubmissions(pid, creid, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/creation/${creid}/submission/`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
  });
  const response = await doApiCall(func, {creation: {}, submissions: []});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}


export async function getUserSubmission(pid, creid, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/creation/${creid}/submission/?users=true`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function createSubmission(pid, creid, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/creation/${creid}/submission/`);
  const func = () => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
    body: JSON.stringify({content: ""}),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function updateSubmissionContent(pid, creid, ucid, content, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/creation/${creid}/submission/${ucid}/`);
  const func = () => fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
    body: JSON.stringify({content}),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function submitUserCreation(pid, creid, ucid) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/creation/${creid}/submission/${ucid}/`);
  const func = () => fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": getAuthToken(),
    },
    body: JSON.stringify({submit: true}),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function uploadEditorDoc(pid, creid, ucid, file, jwt){
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = new URL(`${LIP_API_BASE}/project/${pid}/creation/${creid}/submission/${ucid}/file`);
    const func = () => fetch(url, {
        method: "POST",
        headers: {
            "x-lip-d-jwt": jwt,
        },
        body: formData
    });
    const response = await doApiCall(func, {});
    if (response instanceof Response) {
        return await response.json();
    }
    return response;
}

export async function getCreationsCampaigns(pid, jwt, active=true) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/campaign/?active=${active}`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
  });
  const response = await doApiCall(func, {campaigns: []});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}


export async function getVotingCampaign(pid, cvcid) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/campaign/${cvcid}/`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": getAuthToken(),
    },
  });
  const response = await doApiCall(func, {campaigns: []});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}


export async function voteOnEntry(pid, cvcid, cveid, vote) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/campaign/${cvcid}/entry/${cveid}`);
  const func = () => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": getAuthToken(),
    },
    body: JSON.stringify({vote}),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}