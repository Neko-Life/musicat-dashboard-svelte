import type { IGetLoginParams, IPostLoginData } from '$lib/interfaces/services/auth';
import { getAPIUrl } from '$lib/utils/services';

export async function getLogin({ headerRedirect }: IGetLoginParams = {}) {
	const url = getAPIUrl('/login');

	const headers: [string, string][] = [];

	if (headerRedirect?.length) {
		headers.push(['redirect-param', headerRedirect]);
	}

	const res = fetch(url, {
		headers
	});

	return res;
}

export async function postLogin(data: IPostLoginData) {
	const url = getAPIUrl('/login');

	const res = fetch(url, {
		method: 'POST',
		body: JSON.stringify(data)
	});

	return res;
}
