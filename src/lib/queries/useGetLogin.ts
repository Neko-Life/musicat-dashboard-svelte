import { getLoginQueryId } from '$lib/config/queryIds';
import type {
	IGetDefaultGetLoginSuccessHandlerParams,
	IUseGetLoginParams
} from '$lib/interfaces/queries/useGetLogin';
import type { IBaseAPIResponse } from '$lib/interfaces/services';
import { getLogin } from '$lib/services/auth';
import { createLoginRedirectParam } from '$lib/utils/url';
import { useQuery } from '@sveltestack/svelte-query';

export function getDefaultGetLoginSuccessHandler({
	origin,
	goto,
	cb
}: IGetDefaultGetLoginSuccessHandlerParams) {
	return (r: IBaseAPIResponse<string>) => {
		console.log({ r });
		if (!r.success) {
			console.error('getLogin.json');
			return;
		}

		const redir = '&' + createLoginRedirectParam(origin + '/login');

		const g = r.data + redir;

		cb?.();

		goto(g);
	};
}

export default function useGetLogin({ successRedirect, isInvite }: IUseGetLoginParams) {
	return useQuery(
		getLoginQueryId + (isInvite ? '-invite' : ''),
		() => getLogin({ headerRedirect: successRedirect, isInvite }),
		{
			enabled: false
		}
	);
}
