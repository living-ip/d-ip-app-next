import {LIP_API_BASE} from "@/lib/constants";
import * as changeKeys from "change-case/keys";
import {doApiCall} from "@/lib/api";


export async function getProjectUsers(project_id, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/admin/users`);
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


export async function addUserToProject(project_id, data, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/admin/users`);
  const func = () => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
    body: JSON.stringify(changeKeys.snakeCase(data)),
  });
  const response = await doApiCall(func, undefined);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}


export async function removeUserFromProject(project_id, user_id, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/admin/users/${user_id}`);
  const func = () => fetch(url, {
    method: "DELETE",
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


export async function updateProjectUserRole(project_id, user_id, role, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/admin/users/${user_id}/role`);
  const func = () => fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
    body: JSON.stringify(changeKeys.snakeCase({
      role: role,
    })),
  });
  const response = await doApiCall(func, undefined);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}


export async function getChangesRules(project_id, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/admin/changes-rules`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    }
  });
  const response = await doApiCall(func, undefined);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}


export async function updateChangesRules(project_id, updateChangesRules, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/admin/changes-rules`);
  const func = () => fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
    body: JSON.stringify(changeKeys.snakeCase({
      changes_rules: updateChangesRules,
    })),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}


export async function getVotingRules(project_id, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/admin/voting-rules`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    }
  });
  const response = await doApiCall(func, undefined);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}


export async function updateVotingRules(project_id, updateVotingRules, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/admin/voting-rules`);
  const func = () => fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
    body: JSON.stringify(changeKeys.snakeCase(updateVotingRules)),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}


export async function getProjectInvites(project_id, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/admin/invites`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    }
  });
  const response = await doApiCall(func, []);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}


export async function getProjectAccessRequests(project_id, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/access-request`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    }
  });
  const response = await doApiCall(func, []);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function rejectAccessRequest(project_id, request_id, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/access-request/${request_id}`);
  const func = () => fetch(url, {
    method: "DELETE",
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

export async function acceptAccessRequest(project_id, request_id, role, jwt) {
  const url = new URL(`${LIP_API_BASE}/project/${project_id}/access-request/${request_id}`);
  const func = () => fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
    body: JSON.stringify(changeKeys.snakeCase({
      role: role,
    })),
  });
  const response = await doApiCall(func, undefined);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}
