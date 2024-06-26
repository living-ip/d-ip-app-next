import { LIP_API_BASE } from "./constants";
import { doApiCall } from "./api";
import * as changeKeys from "change-case/keys";

export async function getUserProfile(userId, jwt) {
  const url = new URL(`${LIP_API_BASE}/user/${userId}`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    const data = await response.json()
    return { userProfile: data.user, roles: data.roles };
  }
  return response;
}

export async function createUserProfile(userDetails, jwt) {
  const url = new URL(`${LIP_API_BASE}/user/`);
  const func = () => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
    body: JSON.stringify(changeKeys.snakeCase({
      ...userDetails,
    })),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function updateUserProfile(userId, userDetails, jwt) {
  const url = new URL(`${LIP_API_BASE}/user/${userId}`);
  const func = () => fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
    body: JSON.stringify(changeKeys.snakeCase({
      ...userDetails,
    })),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function getUserRoles(userId, jwt) {
  const url = new URL(`${LIP_API_BASE}/user/${userId}/roles`);
  const func = () => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
  });
  const response = await doApiCall(func, []);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}
