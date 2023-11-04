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
		goto('/login?redirect=' + successRedir);
	};

	const handleLogoutClick = () => {
		goto('/logout');
	};

	let hasUser = false;
	let userAvatar: string | undefined;
	let avatarDropdownClass: string = '';

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

	const handleAvatarClick = () => {
		avatarDropdownClass = avatarDropdownClass.length ? '' : 'show';
	};
</script>

<div id="top-navbar">
	{#if !hasUser}
		<div class="btn-login-container">
			<Button class="btn-login" on:click={handleLoginClick}>Login</Button>
		</div>
	{:else}
		<div class="user-info-container">
			<AvatarButton class="z-above" on:click={handleAvatarClick} src={userAvatar} />

			<div class="avatar-button-dropdown-container {avatarDropdownClass}">
				<div class="btn-logout-container">
					<Button class="btn-login" on:click={handleLogoutClick}>Logout</Button>
				</div>
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
		z-index: 5;
	}

	.btn-login-container,
	.btn-logout-container,
	.user-info-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0px 24px;
		width: 115px;
		box-sizing: border-box;
	}

	.btn-logout-container {
		position: absolute;
		padding: 8px;
	}

	.user-info-container {
		flex-direction: column;
	}

	.avatar-button-dropdown-container {
		display: flex;
		justify-content: center;
	}

	.avatar-button-dropdown-container .btn-logout-container {
		transition: opacity 0.5s ease-in, transform 0.5s ease-out, visibility 0.5s ease-out;
		opacity: 0;
		visibility: hidden;
		transform: translateY(-100%);
	}

	.avatar-button-dropdown-container.show .btn-logout-container {
		opacity: 1;
		visibility: visible;
		transform: translateY(0%);
	}
</style>
