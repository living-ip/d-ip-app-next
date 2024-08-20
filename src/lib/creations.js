import { LIP_API_BASE } from "./constants";
import { doApiCall } from "./api";
import * as changeKeys from "change-case/keys";

export async function getProjectCreations(pid) {
  const url = new URL(`${LIP_API_BASE}/project/${pid}/creation/`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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