<script lang="ts">
	import Button from './common/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getStorage } from '$lib/utils/localStorage';

	const successRedir = encodeURIComponent($page.url.pathname);

	const handleLoginClick = () => {
		goto('/login?redirect=' + encodeURIComponent(successRedir));
	};

	const handleLogoutClick = () => {
		goto('/logout');
	};

	const user = getStorage('user');
// !TODO
</script>

<div id="top-navbar">
	{#if !user}
		<div class="btn-login-container">
			<Button class="btn-login" on:click={handleLoginClick}>Login</Button>
		</div>
	{:else}
		<div class="user-info-container">
			<div class="avatar" />
			<div class="btn-login-container">
				<Button class="btn-login" on:click={handleLogoutClick}>Logout</Button>
			</div>
		</div>
	{/if}
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

	.user-info-container {
	}
</style>
