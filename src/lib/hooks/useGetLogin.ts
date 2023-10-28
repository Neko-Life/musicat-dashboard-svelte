import { getLoginQueryId } from '$lib/config/queryIds';
import type { IUseGetLoginParams } from '$lib/interfaces/hooks/useGetLogin';
import { getLogin } from '$lib/services/auth';
import { useQuery } from '@sveltestack/svelte-query';

export default function useGetLogin({ successRedirect, onSuccess }: IUseGetLoginParams) {
	return useQuery(getLoginQueryId, () => getLogin({ headerRedirect: successRedirect }), {
		enabled: false,
		onSuccess
	});
}
