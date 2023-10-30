import type { IBaseAPIResponse } from '$lib/interfaces/services';
import type {
	IGetLoginParams,
	IPostLoginData,
	IPostLoginResponse
} from '$lib/interfaces/services/auth';
import { processResponse } from '$lib/utils/fetch';
import { getAPIUrl } from '$lib/utils/services';

export async function getLogin({ headerRedirect }: IGetLoginParams = {}) {
	const url = getAPIUrl('/login');

	const headers: [string, string][] = [];

	if (headerRedirect?.length) {
		headers.push(['redirect-param', headerRedirect]);
	}

	const res = await fetch(url, {
		headers,
		credentials: 'include'
	});

	return processResponse<IBaseAPIResponse<string>>(res);
}

export async function postLogin(data: IPostLoginData) {
	const url = getAPIUrl('/login');

	const res = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
		credentials: 'include'
	});

	return processResponse<IBaseAPIResponse<IPostLoginResponse>>(res);
}
