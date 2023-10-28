import { getLoginQueryId } from '$lib/config/queryIds';
import type {
	IGetDefaultGetLoginSuccessHandlerParams,
	IUseGetLoginParams
} from '$lib/interfaces/hooks/useGetLogin';
import type { IBaseAPIResponse } from '$lib/interfaces/services';
import { getLogin } from '$lib/services/auth';
import { useQuery } from '@sveltestack/svelte-query';

export function getDefaultGetLoginSuccessHandler({
	origin,
	goto,
	cb
}: IGetDefaultGetLoginSuccessHandlerParams) {
	return (r: IBaseAPIResponse<string>) => {
		if (!r.success) {
			console.error('getLogin.json');
			return;
		}

		const redir = '&redirect=' + encodeURIComponent(origin + '/login');

		const g = r.data + redir;

		console.log({ g });

		cb?.();

		goto(g);
	};
}

export default function useGetLogin({ successRedirect }: IUseGetLoginParams) {
	return useQuery(getLoginQueryId, () => getLogin({ headerRedirect: successRedirect }), {
		enabled: false
	});
}
