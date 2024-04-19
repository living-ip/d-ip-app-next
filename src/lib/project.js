import { LIP_API_BASE } from "./constants";
import { doApiCall } from "./api";
import * as changeKeys from "change-case/keys";

export async function getProjects(jwt) {
  const url = new URL(`${LIP_API_BASE}/project`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function createProject(projectDetails, jwt) {
  const url = new URL(`${LIP_API_BASE}/project`);
  const func = () => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
    body: JSON.stringify(changeKeys.snakeCase({
      ...projectDetails,
    })),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function getProject(projectId, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${projectId}`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
  });
  const response = await doApiCall(func, undefined);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function updateProject(projectId, projectDetails, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${projectId}`);
  const func = () => fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
    body: JSON.stringify(changeKeys.snakeCase({
      ...projectDetails,
    })),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function deleteProject(projectId, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${projectId}`);
  const func = () => fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function getProjectDocuments(projectId, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${projectId}/document`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function createProjectDocument(projectId, documentDetails, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${projectId}/document`);
  const func = () => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
    body: JSON.stringify(changeKeys.snakeCase({
      ...documentDetails,
    })),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}