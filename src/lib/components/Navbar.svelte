<script lang="ts">
	export let hidden: boolean | undefined;

	import Button from './common/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getUserAvatarLink } from '$lib/utils/user';
	import AvatarButton from './Navbar/AvatarButton.svelte';
	import Menu from './Navbar/Menu.svelte';
	import useGetMusicatUser from '$lib/queries/useGetMusicatUser';
	import { user } from '$lib/store';
	import { matchPath } from '$lib/utils/url';

	const successRedir = encodeURIComponent($page.url.pathname);

	let avatarDropdownClass: string = '';

	let userAvatar: string | undefined;
	let musicatUser: ReturnType<typeof useGetMusicatUser>;
	let loggedInMenus: { name: string; path: string }[];
	let menuList: typeof loggedInMenus;

	$: {
		musicatUser = useGetMusicatUser();

		if ($user) {
			userAvatar = getUserAvatarLink({
				userId: $user.id,
				hash: $user.avatar,
				size: 64
			});
		} else userAvatar = undefined;

		loggedInMenus = $user
			? [
					{
						name: 'My Server List',
						path: '/guilds'
					}
			  ]
			: [];

		menuList = [
			{
				name: 'Home',
				path: '/'
			},
			...loggedInMenus
		];
	}

	const handleLoginClick = () => {
		goto('/login?redirect=' + successRedir);
	};

	const handleLogoutClick = () => {
		goto('/logout');
	};

	const handleAvatarClick = () => {
		avatarDropdownClass = avatarDropdownClass.length ? '' : 'show';
	};

	const handleMusicatAvatarClick = () => {
		// window.location.href=
	};

	const handleMenuClick = (menu: (typeof menuList)[number]) => {
		goto(menu.path);
	};
</script>

<div id="top-navbar" class={hidden ? 'hidden' : ''}>
	<AvatarButton on:click={handleMusicatAvatarClick} src={$musicatUser?.data?.data?.avatar_url} />

	<div class="menu-list">
		{#each menuList as menu}
			<Menu
				on:click={() => handleMenuClick(menu)}
				active={matchPath(menu.path, $page.url.pathname)}
			>
				<span class="menu-name">{menu.name}</span>
			</Menu>
		{/each}
	</div>

	{#if !$user}
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
		transition-duration: 2s;
		position: sticky;
		width: 100%;
		box-sizing: border-box;
		top: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px;
		z-index: 5;
		backdrop-filter: blur(5px);
		transform: translateY(0%);
	}

	#top-navbar.hidden {
		transform: translateY(-100%);
	}

	.menu-list {
		display: flex;
		width: 50%;
	}

	.menu-list .menu-name {
		font-weight: bold;
		font-size: 18px;
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
