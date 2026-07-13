import { getLoginQueryId } from '$lib/config/queryIds';
import type {
	IGetDefaultGetLoginSuccessHandlerParams,
	IUseGetLoginParams
} from '$lib/interfaces/queries/useGetLogin';
import type { IBaseAPIResponse } from '$lib/interfaces/services';
import { getLogin } from '$lib/services/auth';
import { createLoginRedirectParam } from '$lib/utils/url';
import { useQuery } from './useQuery';

export function getDefaultGetLoginSuccessHandler({
	origin,
	cb
}: IGetDefaultGetLoginSuccessHandlerParams) {
	return (r: IBaseAPIResponse<string>) => {
		if (!r.success) {
			console.error('getLogin.json');
			return;
		}

		const redir = '&' + createLoginRedirectParam(origin + '/login');

		const g = r.data + redir;
		cb?.();
		window.location.href = g;
	};
}

export default function useGetLogin(
	{ successRedirect, isInvite }: IUseGetLoginParams,
	opt?: Parameters<
		typeof useQuery<
			string,
			Awaited<ReturnType<typeof getLogin>>,
			Error,
			Awaited<ReturnType<typeof getLogin>>,
			readonly [string]
		>
	>[2]
) {
	return useQuery(
		getLoginQueryId + (isInvite ? '-invite' : ''),
		() => getLogin({ headerRedirect: successRedirect, isInvite }),
		opt
	);
}
