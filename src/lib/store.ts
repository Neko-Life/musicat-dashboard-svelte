import { writable } from 'svelte/store';
import { getStorage } from './utils/localStorage';
import type { IUser } from './interfaces/services/auth';

export const hideNavbar = writable(false);

export const user = writable<IUser | undefined>();

export function updateUser() {
	user.set(getStorage('user'));
}
