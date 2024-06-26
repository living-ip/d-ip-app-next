import {LIP_API_BASE} from "@/lib/constants";
import {doApiCall} from "@/lib/api";


export async function getChange(changeId, jwt) {
  const url = new URL(`${LIP_API_BASE}/change/${changeId}`);
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

export async function updateChange(changeId, changeDetails, jwt) {
  const url = new URL(`${LIP_API_BASE}/change/${changeId}`);
  const func = () => fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
    body: JSON.stringify(changeDetails),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function deleteChange(changeId, jwt) {
  const url = new URL(`${LIP_API_BASE}/change/${changeId}`);
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

export async function publishChange(changeId, jwt) {
  const url = new URL(`${LIP_API_BASE}/change/${changeId}/publish`);
  const func = () => fetch(url, {
    method: "POST",
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

export async function getChangeVotes(changeId, queryParams = {}, jwt) {
  const params = new URLSearchParams(queryParams).toString();
  const url = new URL(`${LIP_API_BASE}/change/${changeId}/vote`);
  url.search = params;
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

export async function voteOnChange(changeId, vote, jwt) {
  const url = new URL(`${LIP_API_BASE}/change/${changeId}/vote`);
  const func = () => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lip-jwt": jwt,
    },
    body: JSON.stringify(vote),
  });
  const response = await doApiCall(func, undefined);
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}