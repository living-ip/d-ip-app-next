import {LIP_API_BASE} from "@/lib/constants";
import {doApiCall} from "@/lib/api";

export async function sendMessage(pid, data) {
	const url = new URL(`${LIP_API_BASE}/project/${pid}/agent`);
	try {
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Accept": "text/event-stream",
				"Content-Type": "application/json",
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

export async function getAgentChatHistory(pid) {
	const url = new URL(`${LIP_API_BASE}/project/${pid}/agent`);
	const func = () => fetch(url, {
		method: "GET",
		headers: {
        "Content-Type": "application/json",
        },
	});
	const response = await doApiCall(func, {});
	if (response instanceof Response) {
		return await response.json();
	}
	return response
}
