import { LIP_API_BASE } from "./constants";
import { doApiCall } from "./api";
import * as changeKeys from "change-case/keys";

export async function getProjects(jwt) {
  const url = new URL(`${LIP_API_BASE}/project/`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
  });
  const response = await doApiCall(func, []);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function createProject(projectDetails, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/`);
  const func = () => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
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
      "x-lip-d-jwt": jwt,
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
      "x-lip-d-jwt": jwt,
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
      "x-lip-d-jwt": jwt,
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
      "x-lip-d-jwt": jwt,
    },
  });
  const response = await doApiCall(func, []);
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
      "x-lip-d-jwt": jwt,
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

export async function requestProjectAccess(projectId, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${projectId}/access-request`);
  const func = () => fetch(url, {
    method: "POST",
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

export async function getOpenVotingCampaigns(){
  // TODO impl
  return [
    {
      id: "1",
      title: "Voting Test 1",
      projectName: "Dan Test 2",
      voteCount: 69
    },
      {
      id: "2",
      title: "Voting Test 1",
      projectName: "Dan Test 2",
      voteCount: 69
    },
      {
      id: "3",
      title: "Voting Test 1",
      projectName: "Dan Test 2",
      voteCount: 69
    },
      {
      id: "4",
      title: "Voting Test 1",
      projectName: "Dan Test 2",
      voteCount: 69
    },
      {
      id: "5",
      title: "Voting Test 1",
      projectName: "Dan Test 2",
      voteCount: 69
    },
      {
      id: "6",
      title: "Voting Test 1",
      projectName: "Dan Test 2",
      voteCount: 69
    },
      {
      id: "7",
      title: "Voting Test 1",
      projectName: "Dan Test 2",
      voteCount: 69
    }
  ];
}