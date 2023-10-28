import { getAPIUrl } from '$lib/utils/services';

export async function getLogin() {
	const url = getAPIUrl('/login');

	const res = await fetch(url);

	return res;
}
