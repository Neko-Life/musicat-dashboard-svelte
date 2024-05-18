import { getUserGuildsQueryId } from '$lib/config/queryIds';
import type { IUseGetUserGuildsParams } from '$lib/interfaces/queries/useGetUserGuilds';
import { getUserGuilds } from '$lib/services/general';
import { getStorage } from '$lib/utils/localStorage';
import { useQuery } from '@sveltestack/svelte-query';

export default function useGetUserGuilds({ enabled = true }: IUseGetUserGuildsParams = {}) {
	const user = getStorage('user');

	return useQuery([getUserGuildsQueryId, user?.id], () => getUserGuilds(), {
		enabled: !!user?.id && enabled
	});
}
