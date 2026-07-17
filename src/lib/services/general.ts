import type { IBaseAPIResponse } from '$lib/interfaces/services';
import type { IBotPreview, IFetchParameters, IUserGuild } from '$lib/interfaces/services/general';
import { isOnBrowser } from '$lib/utils/common';
import { processResponse } from '$lib/utils/fetch';
import { getAPIUrl } from '$lib/utils/services';
import { createLoginRedirectParam } from '$lib/utils/url';

export function getDefaultFetchOptions(options?: IFetchParameters[1]): IFetchParameters[1] {
	let ret = options || {};

	if (ret.credentials === undefined) {
		ret.credentials = 'include';
	}

	return ret;
}

export async function doFetch(...args: IFetchParameters) {
	// check if this is server side rendering calling this
	if (!isOnBrowser()) {
		return;
	}

	args[1] = getDefaultFetchOptions(args[1]);

	try {
		const res = await fetch(...args);

		if (!res.ok) {
			throw res;
		}

		return res;
	} catch (e) {
		console.error('ERROR doFetch:');
		console.error(e);

		if (e instanceof Response) {
			if (e.status === 401) {
				window.location.href = '/login?' + createLoginRedirectParam(window.location.href);
				return;
			}
		}

		throw e;
	}
}

export async function getMusicatUser() {
	const url = getAPIUrl('/');

	const res = await doFetch(url);

	return processResponse<IBaseAPIResponse<IBotPreview>>(res);
}

export async function getUserGuilds() {
	const url = getAPIUrl('/guilds');

	const res = await doFetch(url);

	return processResponse<IBaseAPIResponse<IUserGuild[]>>(res);
}

export async function postLogout() {
	const url = getAPIUrl('/logout');

	const res = await fetch(url, {
		method: 'POST',
		credentials: 'include'
	});

	if (res && !res.ok) throw res;

	return res;
}
