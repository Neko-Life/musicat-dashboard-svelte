import { getAPIUrl } from '$lib/utils/services';

export async function getBotPreview() {
	const url = getAPIUrl('/');

	const res = await fetch(url);

	return res;
}
