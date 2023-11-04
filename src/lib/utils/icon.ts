import { DISCORD_CDN } from '$lib/config/constants';

export const getIconFallback = (size = 128) => {
	const link = DISCORD_CDN + '/embed/avatars/0.png';

	if (size) {
		return link + '?size=' + size;
	}

	return link;
};
