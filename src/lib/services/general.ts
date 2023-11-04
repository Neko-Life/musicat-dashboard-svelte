import type { IBaseAPIResponse } from '$lib/interfaces/services';
import type { IBotPreview, IUserGuild } from '$lib/interfaces/services/general';
import { processResponse } from '$lib/utils/fetch';
import { getAPIUrl } from '$lib/utils/services';

export async function getBotPreview() {
	const url = getAPIUrl('/');

	const res = await fetch(url, {
		credentials: 'include'
	});

	return processResponse<IBaseAPIResponse<IBotPreview>>(res);
}

export async function getUserGuilds() {
	const url = getAPIUrl('/guilds');

	const res = await fetch(url, {
		credentials: 'include'
	});

	return processResponse<IBaseAPIResponse<IUserGuild[]>>(res);
}
