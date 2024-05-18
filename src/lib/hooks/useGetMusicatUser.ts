import { useQuery } from '@sveltestack/svelte-query';
import { getMusicatUser } from '$lib/services/general';
import { getMusicatUserQueryId } from '$lib/config/queryIds';

export default function useGetMusicatUser() {
	return useQuery(getMusicatUserQueryId, getMusicatUser);
}
