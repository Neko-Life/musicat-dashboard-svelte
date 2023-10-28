<script lang="ts">
	import { useQueryClient } from '@sveltestack/svelte-query';
	import Button from './common/Button.svelte';
	import useGetLogin, { getDefaultGetLoginSuccessHandler } from '$lib/hooks/useGetLogin';
	import { clearTimer, setTimer } from '$lib/utils/timer';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getLoginQueryId } from '$lib/config/queryIds';

	let shouldGetLogin = false;

	const queryClient = useQueryClient();

	const successRedir = encodeURIComponent($page.url.pathname);

	const handleGetLoginResponse = getDefaultGetLoginSuccessHandler({
		origin: $page.url.origin,
		goto,
		cb: () => {
			timerReset();
		}
	});

	const loginQuery = useGetLogin({
		successRedirect: successRedir,
		onSuccess: handleGetLoginResponse
	});
	$loginQuery;

	let btnTimer: ReturnType<typeof setTimeout> | null = null;

	const clearBtnTimer = () => {
		clearTimer(btnTimer);
	};

	const timerReset = () => {
		shouldGetLogin = false;
		loginQuery.setEnabled(false);
		queryClient.invalidateQueries(getLoginQueryId);
	};

	const setBtnTimer = () => {
		btnTimer = setTimer(btnTimer, timerReset, 5000);
	};

	const handleLoginClick = () => {
		clearBtnTimer();
		shouldGetLogin = true;
		loginQuery.setEnabled(true);
		setBtnTimer();
	};
</script>

<div id="top-navbar">
	<div class="btn-login-container">
		<Button class="btn-login" on:click={handleLoginClick} disabled={shouldGetLogin}>Login</Button>
	</div>
</div>

<style>
	#top-navbar {
		position: fixed;
		width: 100%;
		box-sizing: border-box;
		top: 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 24px;
	}

	.btn-login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0px 24px;
	}
</style>
