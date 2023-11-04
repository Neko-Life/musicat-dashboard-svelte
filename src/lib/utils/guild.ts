import { DISCORD_CDN } from '$lib/config/constants';
import { getIconFallback } from './icon';

export function getGuildIconLink({ guildId = '', hash = '', format = '', size = 4096 } = {}) {
	if (!hash?.length || !guildId.length) return getIconFallback(size);

	if (!format.length) {
		format = hash.startsWith('a_') ? 'gif' : 'png';
	}

	const ret = DISCORD_CDN + `/icons/${guildId}/${hash}.${format}`;

	if (size) {
		return ret + `?size=${size}`;
	}

	return ret;
}
