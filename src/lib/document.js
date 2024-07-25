import {LIP_API_BASE} from "@/lib/constants";
import {doApiCall} from "@/lib/api";

export async function getDocument(documentId, jwt) {
  const url = new URL(`${LIP_API_BASE}/document/${documentId}`);
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

export async function updateDocument(documentId, documentDetails, jwt) {
  const url = new URL(`${LIP_API_BASE}/document/${documentId}`);
  const func = () => fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
    body: JSON.stringify(documentDetails),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function deleteDocument(documentId, jwt) {
  const url = new URL(`${LIP_API_BASE}/document/${documentId}`);
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

export async function createDocumentChange(documentId, changeDetails, jwt) {
  const url = new URL(`${LIP_API_BASE}/document/${documentId}/change`);
  const func = () => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lip-d-jwt": jwt,
    },
    body: JSON.stringify(changeDetails),
  });
  const response = await doApiCall(func, {});
  if (response instanceof Response) {
    return await response.json();
  }
  return response;
}

export async function getDocumentChanges(documentId, queryParams = {}, jwt) {
  const params = new URLSearchParams(queryParams).toString();
  const url = new URL(`${LIP_API_BASE}/document/${documentId}/change`);
  url.search = params;
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