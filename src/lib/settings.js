import {LIP_API_BASE} from "@/lib/constants";
import {doApiCall} from "@/lib/api";


export async function getProjectSettings(pid, jwt) {
	const url = new URL(`${LIP_API_BASE}/project/${pid}/settings`);
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

export async function updateProjectSettings(pid, settings, jwt) {
	const url = new URL(`${LIP_API_BASE}/project/${pid}/settings`);
	const func = () => fetch(url, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			"x-lip-d-jwt": jwt,
		},
		body: JSON.stringify(settings),
	});
	const response = await doApiCall(func, {});
	if (response instanceof Response) {
		return await response.json();
	}
	return response;
}
