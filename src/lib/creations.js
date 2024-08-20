import { LIP_API_BASE } from "./constants";
import { doApiCall } from "./api";

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