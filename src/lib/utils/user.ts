import { DISCORD_CDN } from '$lib/config/constants';
import type { IUser } from '$lib/interfaces/services/auth';
import { user as userStore } from '$lib/store';
import { getIconFallback } from './icon';
import { removeStorage, setStorage } from './localStorage';

export function setLoggedInUser(user: IUser) {
	setStorage('user', user);
	userStore.set(user);
}

export function removeLoggedInUser() {
	removeStorage('user');
	userStore.set(undefined);
}

export function getUserAvatarLink({ userId = '', hash = '', format = '', size = 4096 } = {}) {
	if (!hash?.length || !userId.length) return getIconFallback(size);

	if (!format.length) {
		format = hash.startsWith('a_') ? 'gif' : 'png';
	}

	const ret = DISCORD_CDN + `/avatars/${userId}/${hash}.${format}`;

	if (size) {
		return ret + `?size=${size}`;
	}

	return ret;
}
