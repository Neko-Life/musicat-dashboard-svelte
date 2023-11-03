import { DISCORD_CDN } from '$lib/config/constants';

export function getUserAvatarLink({ userId = '', hash = '', format = '', size = 4096 } = {}) {
	if (!hash.length || !userId.length) return undefined;

	if (!format.length) {
		format = hash.startsWith('a_') ? 'gif' : 'png';
	}

	const ret = DISCORD_CDN + `/avatars/${userId}/${hash}.${format}`;

	if (size) {
		return ret + `?size=${size}`;
	}

	return ret;
}
