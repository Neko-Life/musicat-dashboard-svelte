export async function getJson(res: Response) {
	if (res.headers.get('Content-Type') === 'application/json') {
		return res.json();
	}

	return;
}

export async function processResponse<T>(res: Response) {
	if (!res.ok) throw res;

	const json: T = await getJson(res);

	// if (!json) throw new Error('Invalid or empty response');

	return json;
}
