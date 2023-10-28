<script lang="ts">
	import { useQueryClient } from '@sveltestack/svelte-query';
	import Button from './common/Button.svelte';
	import useGetLogin from '$lib/hooks/useGetLogin';
	import { clearTimer, setTimer } from '$lib/utils/timer';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { IBaseAPIResponse } from '$lib/interfaces/services';
	import { getLoginQueryId } from '$lib/config/queryIds';

	let shouldGetLogin = false;

	const queryClient = useQueryClient();

	const handleGetLoginResponse = (data: Response) => {
		data.json().then((r: IBaseAPIResponse<string>) => {
			const redir = '&redirect=' + encodeURIComponent($page.url.origin + '/login');

			const g = r.data + redir;

			console.log({ g });

			goto(g);
		});
	};

	const successRedir = encodeURIComponent($page.url.pathname);

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
		shouldGetLogin = true;
		loginQuery.setEnabled(true);
		clearBtnTimer();
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
