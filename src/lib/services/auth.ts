import type { IGetLoginParams } from '$lib/interfaces/services/auth';
import { getAPIUrl } from '$lib/utils/services';

export async function getLogin({ headerRedirect }: IGetLoginParams = {}) {
	const url = getAPIUrl('/login');

	const headers: [string, string][] = [];

	if (headerRedirect?.length) {
		headers.push(['redirect-param', headerRedirect]);
	}

	const res = await fetch(url, {
		headers
	});

	return res;
}
