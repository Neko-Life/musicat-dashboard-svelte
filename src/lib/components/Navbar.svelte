<script lang="ts">
	let { hidden }: { hidden: boolean | undefined } = $props();

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
	import { type Snippet } from 'svelte';

	let showMobileMenus = $state(false);

	let avatarDropdownClass: string = $state('');
	let mcAvatarDropdownClass: string = $state('');
	let mcAvatarMobileDropdownClass: string = $state('');

	const musicatUser = useGetMusicatUser();

	const userAvatar: string | undefined = $derived(
		getUserAvatarLink({
			userId: $user?.id,
			hash: $user?.avatar,
			size: 64
		})
	);
	const mcAvatar: string | undefined = $derived(musicatUser?.data?.data.avatar_url);
	const loggedInMenus: { name: string; path: string }[] = $derived(
		$user
			? [
					{
						name: 'My Server List',
						path: '/guilds'
					}
				]
			: []
	);
	const menuList: typeof loggedInMenus = $derived([
		{
			name: 'Home',
			path: '/'
		},
		...loggedInMenus
	]);

	const handleLogoutClick = () => {
		goto('/logout');
	};

	const handleAvatarClick = () => {
		avatarDropdownClass = avatarDropdownClass.length ? '' : 'show';
	};

	const handleMusicatAvatarClick = () => {
		mcAvatarDropdownClass = mcAvatarDropdownClass.length ? '' : 'show';
	};

	const handleMusicatAvatarMobileClick = () => {
		mcAvatarMobileDropdownClass = mcAvatarMobileDropdownClass.length ? '' : 'show';
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

{#snippet musicatInviteBtn()}
	<Button class="btn-login" on:click={handleInviteClick}>Invite</Button>
{/snippet}

{#snippet logoutBtn()}
	<Button class="btn-login" on:click={handleLogoutClick}>Logout</Button>
{/snippet}

{#snippet userInfoContainer(
	additionalClass?: string,
	avatarDropdownClass?: string,
	handleAvatarClick?: () => void,
	dropdownBtn?: Snippet,
	avatarSrc?: string
)}
	<div class="user-info-container {additionalClass || ''}">
		<OuterClick
			onOuterClick={avatarDropdownClass?.length ? handleAvatarClick : undefined}
			class="flexcolg0"
		>
			<div class="avatar-button-dropdown-container {avatarDropdownClass}">
				<div class="btn-logout-container">
					{@render dropdownBtn?.()}
				</div>
			</div>

			<AvatarButton on:click={handleAvatarClick || (() => {})} src={avatarSrc} />
		</OuterClick>
	</div>
{/snippet}

<div id="top-navbar" class="bd-blur-5 {hidden ? 'hidden' : ''}">
	<div class="nav">
		{@render userInfoContainer(
			'musicat-info',
			mcAvatarDropdownClass,
			handleMusicatAvatarClick,
			musicatInviteBtn,
			mcAvatar
		)}

		<div class="menu-list">
			<button class="mobile-menu-btn" onclick={handleMobileMenuBtnClick}>
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
			{@render userInfoContainer(
				'',
				avatarDropdownClass,
				handleAvatarClick,
				logoutBtn,
				userAvatar
			)}
		{/if}
	</div>
</div>

<div class="mobile-menus {showMobileMenus ? 'open' : ''}">
	<div class="mobile-menus-top">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div role="button" onclick={handleMobileMenuBtnClick}>
			<ArrowLeftSolid width={40} />
		</div>

		{@render userInfoContainer(
			'mobile-user-info',
			mcAvatarMobileDropdownClass,
			handleMusicatAvatarMobileClick,
			musicatInviteBtn,
			mcAvatar
		)}
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

<style>
	#top-navbar {
		display: flex;
		justify-content: center;
		align-items: center;
		transition-duration: 2s;
		position: sticky;
		top: 0;
		z-index: 5;
		transform: translateY(0%);
	}

	#top-navbar .nav {
		width: 100%;
		box-sizing: border-box;
		justify-content: space-between;
		display: flex;
		align-items: center;
		padding: 16px;
		max-width: 1280px;
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

	.user-info-container.mobile-user-info {
		width: unset;
	}

	.musicat-info {
		display: none;
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
		transition:
			opacity 0.5s ease-in,
			top 0.5s ease-out,
			visibility 0.5s ease-out;
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
		left: -100%;
		width: 100vw;
		height: 100vh;
		z-index: 100;
		background-color: black;
		transition-duration: 300ms;
	}

	.mobile-menus.open {
		left: 0;
	}

	.mobile-menus-top,
	#top-navbar {
		box-shadow: 0px 0px 50px 0 var(--default-color-hint);
		background-color: var(--default-bg-color-hint);
		border-bottom: 1px solid var(--default-color-hint);
	}

	.mobile-menus-top {
		padding: 16px 24px;

		display: flex;
		justify-content: space-between;
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
		gap: 8px;
		justify-content: center;
	}

	.mobile-menu-btn {
		background-color: transparent;
		outline: none;
		border: none;
		border-radius: 6px;
		padding: 4px 8px;
		border: 1px solid transparent;
		width: 115px;
	}

	.mobile-menu-btn:active,
	.mobile-menu-btn:hover,
	.mobile-menu-btn:focus {
		border: 1px solid white;
	}

	@media (max-width: 720px) {
		#top-navbar .nav {
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

		.musicat-info {
			display: flex;
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
