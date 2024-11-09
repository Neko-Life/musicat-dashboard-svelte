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
	import { createLoginRedirectParam, matchPath } from '$lib/utils/url';
	import LoginButton from './Buttons/LoginButton.svelte';
	import BarsSolid from '$lib/components/icons/BarsSolid.svelte';
	import ArrowLeftSolid from './icons/ArrowLeftSolid.svelte';
	import MenuMobile from './Navbar/MenuMobile.svelte';
	import OuterClick from './Hooks/OuterClick.svelte';

	let showMobileMenus = false;

	let avatarDropdownClass: string = '';
	let mcAvatarDropdownClass: string = '';

	const musicatUser = useGetMusicatUser();

	let userAvatar: string | undefined;
	let mcAvatar: string | undefined;
	let loggedInMenus: { name: string; path: string }[];
	let menuList: typeof loggedInMenus;

	$: {
		if ($user) {
			userAvatar = getUserAvatarLink({
				userId: $user.id,
				hash: $user.avatar,
				size: 64
			});
		} else userAvatar = undefined;

		if ($musicatUser?.data?.data) {
			mcAvatar = $musicatUser?.data?.data.avatar_url;
		}

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

	const handleLogoutClick = () => {
		goto('/logout');
	};

	const handleAvatarClick = () => {
		avatarDropdownClass = avatarDropdownClass.length ? '' : 'show';
	};

	const handleMusicatAvatarClick = () => {
		mcAvatarDropdownClass = mcAvatarDropdownClass.length ? '' : 'show';
	};

	const handleInviteClick = () => {
		goto('/login?' + createLoginRedirectParam($page.url.pathname) + '&invite=1');
	};

	const handleMenuClick = (menu: (typeof menuList)[number], isMobile?: boolean) => {
		goto(menu.path);
		if (isMobile) handleMobileMenuBtnClick();
	};

	const handleMobileMenuBtnClick = () => {
		showMobileMenus = !showMobileMenus;
	};
</script>

<div id="top-navbar" class="bd-blur-5 {hidden ? 'hidden' : ''}">
	<div class="user-info-container">
		<OuterClick
			onOuterClick={mcAvatarDropdownClass.length ? handleMusicatAvatarClick : undefined}
			class="flexcolg0"
		>
			<div class="avatar-button-dropdown-container {mcAvatarDropdownClass}">
				<div class="btn-logout-container">
					<Button class="btn-login" on:click={handleInviteClick}>Invite</Button>
				</div>
			</div>

			<AvatarButton on:click={handleMusicatAvatarClick} src={mcAvatar} />
		</OuterClick>
	</div>

	<div class="menu-list">
		<button class="mobile-menu-btn" on:click={handleMobileMenuBtnClick}>
			<BarsSolid width={35} />
		</button>

		<div class="menu-items-container">
			{#each menuList as menu}
				<Menu
					on:click={() => handleMenuClick(menu)}
					active={matchPath(menu.path, $page.url.pathname)}
				>
					<span class="menu-name">{menu.name}</span>
				</Menu>
			{/each}
		</div>
	</div>

	{#if !$user}
		<div class="btn-login-container">
			<LoginButton />
		</div>
	{:else}
		<div class="user-info-container">
			<OuterClick
				onOuterClick={avatarDropdownClass.length ? handleAvatarClick : undefined}
				class="flexcolg0"
			>
				<div class="avatar-button-dropdown-container {avatarDropdownClass}">
					<div class="btn-logout-container">
						<Button class="btn-login" on:click={handleLogoutClick}>Logout</Button>
					</div>
				</div>

				<AvatarButton on:click={handleAvatarClick} src={userAvatar} />
			</OuterClick>
		</div>
	{/if}
</div>

{#if showMobileMenus}
	<div class="mobile-menus">
		<div class="mobile-menus-top" role="button" on:click={handleMobileMenuBtnClick}>
			<ArrowLeftSolid width={40} />
		</div>

		<div class="mobile-menu-list-container">
			{#each menuList as menu}
				<MenuMobile
					on:click={() => handleMenuClick(menu, true)}
					active={matchPath(menu.path, $page.url.pathname)}
				>
					<span class="menu-name">{menu.name}</span>
				</MenuMobile>
			{/each}
		</div>
	</div>
{/if}

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
		transform: translateY(0%);
	}

	#top-navbar.hidden {
		transform: translateY(-100%);
	}

	.mc-av-container {
		display: flex;
		gap: 8px;
		width: 115px;
	}

	.btn-login-container,
	.btn-logout-container,
	.user-info-container {
		display: flex;
		justify-content: center;
		align-items: center;
		/*padding: 0px 24px;*/
		width: 115px;
		box-sizing: border-box;
	}

	.btn-logout-container {
		position: absolute;
		padding: 8px;
	}

	.user-info-container {
		flex-direction: column;
		position: relative;
	}

	.avatar-button-dropdown-container {
		display: flex;
		justify-content: center;
	}

	.avatar-button-dropdown-container .btn-logout-container {
		transition: opacity 0.5s ease-in, top 0.5s ease-out, visibility 0.5s ease-out;
		opacity: 0;
		visibility: hidden;
		top: 0;
	}

	.avatar-button-dropdown-container.show .btn-logout-container {
		opacity: 1;
		visibility: visible;
		top: 100%;
	}

	.mobile-menus {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 100;
		background-color: black;
	}

	.mobile-menus-top {
		padding: 16px 24px;
		border-bottom: 1px solid blue;
		box-shadow: 0px 0px 50px 0px blue;
	}

	.mobile-menu-list-container {
		display: flex;
		flex-direction: column;
	}

	.menu-list {
		flex-grow: 1;
	}

	.menu-items-container {
		display: none;
		width: 100%;
	}

	.mobile-menu-btn {
		background-color: transparent;
		outline: none;
		border: none;
		border-radius: 6px;
		padding: 4px 8px;
		border: 1px solid transparent;
	}

	.mobile-menu-btn:active,
	.mobile-menu-btn:hover,
	.mobile-menu-btn:focus {
		border: 1px solid white;
	}

	@media (max-width: 720px) {
		#top-navbar {
			padding: 12px 0px;
		}
	}

	@media (min-width: 600px) {
		.menu-list,
		.menu-items-container {
			display: flex;
		}

		.mobile-menu-btn {
			display: none;
		}
	}

	@media (min-width: 900px) {
		.menu-list {
			max-width: 1024px;
		}
	}

	.menu-list .menu-name {
		font-weight: bold;
		font-size: 18px;
	}
</style>
