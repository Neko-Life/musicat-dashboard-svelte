import { getUserGuildsQueryId } from '$lib/config/queryIds';
import type { IUseGetUserGuildsParams } from '$lib/interfaces/queries/useGetUserGuilds';
import { getUserGuilds } from '$lib/services/general';
import { useQuery } from '@sveltestack/svelte-query';
import { user as userStore } from '$lib/store';
import { get } from 'svelte/store';

export default function useGetUserGuilds({ enabled = true }: IUseGetUserGuildsParams = {}) {
	const user = get(userStore);

	const query = useQuery([getUserGuildsQueryId, user?.id], () => getUserGuilds(), {
		enabled
	});

	return query;
}
