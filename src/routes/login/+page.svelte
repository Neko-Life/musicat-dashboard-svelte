<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import useGetLogin, { getDefaultGetLoginSuccessHandler } from '$lib/queries/useGetLogin';
	import { onMount } from 'svelte';
	import { postLogin } from '$lib/services/auth';
	import type { IBaseAPIResponse, IErrorPayload } from '$lib/interfaces/services';
	import { setLoggedInUser } from '$lib/utils/user';

	let loader = $state('Logging in...');

	const successRedir = $derived(
		decodeURIComponent($page.url.searchParams.get('redirect') || '') || '/'
	);

	let loginQueryEnabled = $state(false);
	const loginQuery = $derived(
		useGetLogin(
			{
				successRedirect: successRedir,
				isInvite: $page.url.searchParams.get('invite') === '1'
			},
			{
				enabled: loginQueryEnabled
			}
		)
	);

	const origin = $derived($page.url.origin);
	const handleGetLoginResponse = $derived(
		getDefaultGetLoginSuccessHandler({
			origin,
			cb: () => {
				loginQueryEnabled = false;
			}
		})
	);

	onMount(() => {
		const error = $page.url.searchParams.get('error');
		if (error?.length) {
			const error_description = $page.url.searchParams.get('error_description');
			if (
				error_description == 'The resource owner or authorization server denied the request'
			) {
				loader = "Invite cancelled, you can try to invite again whenever you're ready.";
				return;
			}
			loader = 'Failed logging in: ' + (error_description || error);
			return;
		}

		const code = $page.url.searchParams.get('code');
		if (!code?.length) {
			loginQueryEnabled = true;
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
				if (!data?.success) {
					loader =
						'Error while logging in: ' +
						(data as unknown as IBaseAPIResponse<IErrorPayload>).data.code;

					return;
				}

				const { redirect, user } = data.data;

				setLoggedInUser(user);

				goto(redirect);
			})
			.catch((r: Response) => {
				console.error(r);
				loader = 'Error with status ' + r.status;
			});
	});

	$effect(() => {
		if (loginQuery.data) {
			handleGetLoginResponse(loginQuery.data);
			loginQueryEnabled = false;
		}
	});
</script>

<div class="page-container">
	<h1>{loginQuery.isError ? 'Error logging in' : loader}</h1>
</div>

<style>
	.page-container {
		display: flex;
		flex-grow: 1;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
</style>
