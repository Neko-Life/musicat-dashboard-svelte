<script lang="ts">
	import Button from './common/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getStorage } from '$lib/utils/localStorage';
	import { getUserAvatarLink } from '$lib/utils/user';
	import { onMount } from 'svelte';
	import AvatarButton from './Navbar/AvatarButton.svelte';

	const successRedir = encodeURIComponent($page.url.pathname);

	const handleLoginClick = () => {
		goto('/login?redirect=' + encodeURIComponent(successRedir));
	};

	const handleLogoutClick = () => {
		goto('/logout');
	};

	let hasUser = false;
	let userAvatar: string | undefined;

	onMount(() => {
		const user = getStorage('user');

		console.log({ user });

		if (user) {
			hasUser = true;

			userAvatar = getUserAvatarLink({
				userId: user.id,
				hash: user.avatar,
				size: 64
			});
		}
	});

	const handleAvatarClick = () => {};
</script>

<div id="top-navbar">
	{#if !hasUser}
		<div class="btn-login-container">
			<Button class="btn-login" on:click={handleLoginClick}>Login</Button>
		</div>
	{:else}
		<div class="user-info-container">
			<AvatarButton on:click={handleAvatarClick} src={userAvatar} />

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
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
