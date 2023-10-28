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
	return (data: Response) => {
		data.json().then((r: IBaseAPIResponse<string>) => {
			const redir = '&redirect=' + encodeURIComponent(origin + '/login');

			const g = r.data + redir;

			console.log({ g });

			cb?.();

			goto(g);
		});
	};
}

export default function useGetLogin({ successRedirect, onSuccess }: IUseGetLoginParams) {
	return useQuery(getLoginQueryId, () => getLogin({ headerRedirect: successRedirect }), {
		enabled: false,
		onSuccess
	});
}
