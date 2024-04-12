export const doApiCall = async (func, default_) => {
	try {
		const response = await func();
		if (response.ok) {
			return response
		} else {
			console.warn(await response.text());
			return default_;
		}
	} catch (e) {
		console.log(e);
		return default_;
	}
}
