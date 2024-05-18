import type { user } from '$lib/store';

export interface IUseGetUserGuildsParams {
	user?: typeof user;
	enabled?: boolean;
}
