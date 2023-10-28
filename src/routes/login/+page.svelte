<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import useGetLogin, { getDefaultGetLoginSuccessHandler } from '$lib/hooks/useGetLogin';
	import { onMount } from 'svelte';
	import { postLogin } from '$lib/services/auth';
	import type { IBaseAPIResponse, IErrorPayload } from '$lib/interfaces/services';
	import type { IPostLoginResponse } from '$lib/interfaces/services/auth';

	let loader = 'Logging in...';

	const handleGetLoginResponse = getDefaultGetLoginSuccessHandler({
		origin: $page.url.origin,
		goto,
		cb: () => {
			loginQuery.setEnabled(false);
		}
	});

	const successRedir = encodeURIComponent($page.url.searchParams.get('redirect') || '/');

	const loginQuery = useGetLogin({
		successRedirect: successRedir,
		onSuccess: handleGetLoginResponse
	});
	$loginQuery;

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

		postLogin({ code, state }).then((r: Response) => {
			if (!r.ok) {
				loader = 'Error while logging in';
				return;
			}

			r.json().then((d: IBaseAPIResponse<IPostLoginResponse>) => {
				if (!d.success) {
					loader =
						'Error while logging in: ' +
						(d as unknown as IBaseAPIResponse<IErrorPayload>).data.code;

					return;
				}

				localStorage.setItem('access_token', d.data.access_token);
				goto(d.data.redirect);
			});
		});
	});
</script>

<div class="page-container">
	<h1>{loader}</h1>
</div>

<style>
	.page-container {
		display: flex;
		flex-grow: 1;
		justify-content: center;
		align-items: center;
	}
</style>
