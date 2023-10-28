<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import useGetLogin, { getDefaultGetLoginSuccessHandler } from '$lib/hooks/useGetLogin';
	import { onMount } from 'svelte';

	console.log({ page });

	const handleGetLoginResponse = getDefaultGetLoginSuccessHandler({
		origin: $page.url.origin,
		goto,
		cb: () => {
			loginQuery.setEnabled(false);
		}
	});

	// !TODO: get redir from search params
	const successRedir = encodeURIComponent('/');

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
	});
</script>

<h1>Login</h1>
