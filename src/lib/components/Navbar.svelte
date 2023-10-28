<script lang="ts">
	import { useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import Button from './common/Button.svelte';
	import { getLogin } from '$lib/services/auth';
	import { clearTimer, setTimer } from '$lib/utils/timer';

	let shouldGetLogin = false;

	const queryClient = useQueryClient();

	const getLoginQueryId = 'get-login';

	const loginQuery = useQuery(getLoginQueryId, getLogin, {
		enabled: shouldGetLogin,
		onSuccess: (data) => {
			console.log({ data });
		}
	});
	$loginQuery;

	$: {
		loginQuery.setEnabled(shouldGetLogin);
	}

	let btnTimer: ReturnType<typeof setTimeout> | null = null;

	const clearBtnTimer = () => {
		clearTimer(btnTimer);
	};

	const timerReset = () => {
		shouldGetLogin = false;
		queryClient.invalidateQueries(getLoginQueryId);
	};

	const setBtnTimer = () => {
		btnTimer = setTimer(btnTimer, timerReset, 5000);
	};

	const handleLoginClick = () => {
		shouldGetLogin = true;
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
