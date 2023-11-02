<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import useGetLogin, { getDefaultGetLoginSuccessHandler } from '$lib/hooks/useGetLogin';
	import { onMount } from 'svelte';
	import { postLogin } from '$lib/services/auth';
	import type { IBaseAPIResponse, IErrorPayload } from '$lib/interfaces/services';
	import { setStorage } from '$lib/utils/localStorage';

	let loader = 'Logging in...';

	const origin = $page.url.origin;
	const handleGetLoginResponse = getDefaultGetLoginSuccessHandler({
		origin,
		goto,
		cb: () => {
			loginQuery.setEnabled(false);
		}
	});

	const successRedir = decodeURIComponent($page.url.searchParams.get('redirect') || '') || '/';

	const loginQuery = useGetLogin({
		successRedirect: successRedir
	});

	onMount(() => {
		const code = $page.url.searchParams.get('code');

		if (!code?.length) {
			loginQuery.setEnabled(true);
			return;
		}

		const state = $page.url.searchParams.get('state');

		if (!state?.length) {
			console.error('Missing state, refusing to proceed');

			loader = 'Cannot proceed to login';
			return;
		}

		postLogin({ code, state, redirect_uri: origin + '/login' })
			.then((data) => {
				if (!data.success) {
					loader =
						'Error while logging in: ' +
						(data as unknown as IBaseAPIResponse<IErrorPayload>).data.code;

					return;
				}

				const { redirect, user } = data.data;

				setStorage('user', user);

				goto(redirect);
			})
			.catch((r: Response) => {
				console.error(r);
				loader = 'Error with status ' + r.status;
			});
	});

	$: if ($loginQuery.data) {
		handleGetLoginResponse($loginQuery.data);
	}
</script>

<div class="page-container">
	<h1>{$loginQuery.isError ? 'Error logging in' : loader}</h1>
</div>

<style>
	.page-container {
		display: flex;
		flex-grow: 1;
		justify-content: center;
		align-items: center;
	}
</style>
