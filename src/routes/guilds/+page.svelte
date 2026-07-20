<script lang="ts">
	import GuildCard from '$lib/components/GuildCard.svelte';
	import type { IUserGuild } from '$lib/interfaces/services/general';
	import useGetUserGuilds from '$lib/queries/useGetUserGuilds';
	import { user, pagination } from '$lib/store';
	import { onMount } from 'svelte';

	let search = $state('');
	let perPage = $state(1);

	function setGuildPerPage(widthFor: number, heightFor: number): boolean {
		if (widthFor === Infinity) widthFor = 2;
		if (heightFor === Infinity) heightFor = 5;
		let newPerPage = widthFor * heightFor;
		if (newPerPage < 10) newPerPage = 10;
		const setGridCol = `repeat(${widthFor}, 1fr)`;

		let ret = false;
		if (perPage != newPerPage) {
			perPage = newPerPage;
			ret = true;
		}
		if (!guildListContainerEl) return ret;
		if (guildListContainerEl.style.gridTemplateColumns != setGridCol)
			guildListContainerEl.style.gridTemplateColumns = setGridCol;

		return ret;
	}

	function getCardGap() {
		const guildListGapMobile = 0;
		const guildListGap1024 = 20;
		const guildListGap1366 = 30;

		const cw = document.body.clientWidth;
		return cw > 1366 ? guildListGap1366 : cw > 1024 ? guildListGap1024 : guildListGapMobile;
	}

	let guildListContainerEl: HTMLDivElement | undefined = $state();
	let guildListContainerWidth: number = $state(0);
	let guildListContainerHeight: number = $state(0);
	let guildCardWidth: number = $state(0);
	let guildCardHeight: number = $state(0);
	let widthFor: number = $state(0);
	let heightFor: number = $state(0);

	function calcAvailableSpace() {
		if (document.body.clientWidth < 242) return setGuildPerPage(1, 10);

		const guildListXPadding = 40;
		const guildListYPadding = 60;

		const cardGap = getCardGap();

		if (guildListContainerWidth > (window.visualViewport?.width || 0)) {
			setGuildPerPage(widthFor - 2, heightFor);
			return;
		}
		if (guildListContainerHeight > (document.body.clientHeight || 0)) {
			setGuildPerPage(widthFor, heightFor - 2);
			return;
		}

		const availableX = guildListContainerWidth - guildListXPadding;
		const availableY = guildListContainerHeight - guildListYPadding;
		widthFor = Math.floor((availableX + cardGap) / (cardGap + guildCardWidth));
		heightFor = Math.floor((availableY + cardGap) / (cardGap + guildCardHeight));

		if (!setGuildPerPage(widthFor, heightFor)) return;
		setTimeout(calcAvailableSpace, 100);
	}

	$effect(() => {
		if (
			!guildListContainerWidth ||
			!guildListContainerHeight ||
			!guildCardWidth ||
			!guildCardHeight
		)
			return;

		calcAvailableSpace();
	});

	const userGuilds = $derived(useGetUserGuilds({ enabled: !!$user }));

	const guildList: IUserGuild[] = $derived.by(() => {
		const searchLowCase = search.toLocaleLowerCase();
		return (
			userGuilds.data?.data
				?.filter((v) =>
					search.length ? v.name.toLocaleLowerCase().includes(searchLowCase) : true
				)
				.sort((a, b) => {
					// [has_active_voice_session, is_mutual, else]
					if (a.has_active_voice_session && !b.has_active_voice_session) return -1;
					if (!a.has_active_voice_session && b.has_active_voice_session) return 1;

					if (a.is_mutual && !b.is_mutual) return -1;
					if (!a.is_mutual && b.is_mutual) return 1;

					return 0;
				}) || []
		);
	});

	const newm = $derived((guildList.length && Math.ceil(guildList.length / perPage)) || 1);
	$effect(() => {
		if (!guildList.length) return ($pagination = undefined);
		if (!$pagination) {
			$pagination = {
				page: 1,
				maxPage: 1
			};
		}
		if ($pagination.maxPage === newm) return;
		$pagination.maxPage = newm;
		$pagination.page = 1;
	});

	const guildListInPage: typeof guildList = $derived.by(() => {
		const filterIndexes = perPage * ($pagination?.page || 1);
		return guildList.filter((_v, i) => i >= filterIndexes - perPage && i < filterIndexes);
	});

	function orientationChangeHandler() {
		setTimeout(calcAvailableSpace, 100);
	}
	onMount(() => {
		window.screen.orientation.addEventListener('change', orientationChangeHandler);

		return () => {
			window.screen.orientation.removeEventListener('change', orientationChangeHandler);
			$pagination = undefined;
		};
	});
</script>

<div class="flex-center top-section"></div>

<div class="page-container">
	<div class="content">
		{#if !$user}
			<div class="error-container login-container">You're not logged in</div>
		{:else if userGuilds.isError}
			<div class="error-container">Error getting guilds</div>
		{:else if userGuilds.isLoading}
			<div class="error-container">Loading...</div>
		{:else}
			<div class="top-content">
				<div class="input-container default-inp">
					<input bind:value={search} />
				</div>
			</div>
			<div
				bind:clientWidth={guildListContainerWidth}
				bind:clientHeight={guildListContainerHeight}
				bind:this={guildListContainerEl}
				class="guild-list-container"
			>
				{#each guildListInPage as guild, i}
					{#key guild.id}
						{#if i === 0}
							<div
								class="gcard-container"
								bind:clientWidth={guildCardWidth}
								bind:clientHeight={guildCardHeight}
							>
								<GuildCard {guild} />
							</div>
						{:else}
							<div class="gcard-container">
								<GuildCard {guild} />
							</div>
						{/if}
					{/key}
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.error-container,
	.page-container {
		flex-grow: 1;
	}

	.page-container {
		overflow: hidden;
		min-height: 100vh;
	}

	.error-container {
		display: flex;
		align-items: center;
		font-size: 36px;
		justify-content: center;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

	.top-content {
		width: 100%;
		padding-top: 12px;
		position: fixed;
		right: 0;
		z-index: 1;
		/*
		max-width: 1280px;
                */
	}

	.input-container {
		padding: 4px 12px;
		display: flex;
		box-sizing: border-box;
		max-width: 200px;
	}

	.guild-list-container {
		width: 100%;
		/*
		max-width: 1280px;
                */
		padding: 20px 20px 40px 20px;
		display: grid;
		justify-content: center;
		align-items: center;
		gap: 0px;
		justify-items: center;
		align-content: start;
		box-sizing: border-box;
		flex-grow: 1;
	}

	.top-section {
		position: relative;
	}

	.gcard-container:hover {
		transition-duration: 0.5s;
		z-index: 1;
	}

	@media (min-width: 1024px) {
		.guild-list-container {
			gap: 20px;
		}
	}

	@media (min-width: 1366px) {
		.guild-list-container {
			gap: 30px;
		}
	}
</style>
