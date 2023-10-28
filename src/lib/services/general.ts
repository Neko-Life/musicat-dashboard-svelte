import type { IBaseAPIResponse } from '$lib/interfaces/services';
import type { IBotPreview } from '$lib/interfaces/services/general';
import { processResponse } from '$lib/utils/fetch';
import { getAPIUrl } from '$lib/utils/services';

export async function getBotPreview() {
	const url = getAPIUrl('/');

	const res = await fetch(url);

	return processResponse<IBaseAPIResponse<IBotPreview>>(res);
}
