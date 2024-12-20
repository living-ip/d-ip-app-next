import {LIP_AI_API_BASE, LIP_API_BASE} from "@/lib/constants";
import {doApiCall} from "@/lib/api";

export async function sendMessage(pid, data, jwt) {
	const url = new URL(`${LIP_AI_API_BASE}/project/${pid}/chat`);
	try {
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Accept": "text/event-stream",
				"Content-Type": "application/json",
				"x-lip-d-jwt": jwt,
			},
		});
		console.log(response.statusText)
		if (response.ok) {
			return response.body.getReader()
		} else {
			console.warn(await response.text());
			return "";
		}
	} catch (e) {
		console.log(e);
		return ""
	}
}

export async function getAgentChatHistory(pid, jwt) {
	const url = new URL(`${LIP_AI_API_BASE}/project/${pid}/chat`);
	const func = () => fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-lip-d-jwt": jwt
		},
	});
	const response = await doApiCall(func, {});
	if (response instanceof Response) {
		return await response.json();
	}
	return response
}
