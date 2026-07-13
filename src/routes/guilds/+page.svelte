<script lang="ts">
	import GuildCard from '$lib/components/GuildCard.svelte';
	import type { IUserGuild } from '$lib/interfaces/services/general';
	import useGetUserGuilds from '$lib/queries/useGetUserGuilds';
	import useClientDimension from '$lib/hooks/useClientDimension.svelte';
	import { user, pagination } from '$lib/store';
	import { onMount } from 'svelte';

	let search = $state('');
	let perPage = $state(1);
	const guildListGap1024 = 20;
	const guildListGap1366 = 40;
	const guildListXPadding = 40;
	const guildListYPadding = 60;
	let guildListContainerEl: HTMLDivElement;
	let guildCardEl: HTMLDivElement | undefined;

	const clientDimension = useClientDimension();
	const userGuilds = $derived(useGetUserGuilds({ enabled: !!$user }));

	const guildList: IUserGuild[] = $derived.by(() => {
		const searchLowCase = search.toLocaleLowerCase();
		console.log({ g: userGuilds.data?.data, searchLowCase });
		return (
			userGuilds.data?.data
				?.filter((v) =>
					search.length ? v.name.toLocaleLowerCase().includes(searchLowCase) : true
				)
				.sort((a, b) => {
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
		if ($pagination.maxPage == newm) return;
		$pagination.maxPage = newm;
		$pagination.page = 1;
	});

	const guildListInPage: typeof guildList = $derived.by(() => {
		const filterIndexes = perPage * ($pagination?.page || 1);
		return guildList.filter((_v, i) => i >= filterIndexes - perPage && i < filterIndexes);
	});

	onMount(() => () => ($pagination = undefined));
</script>

<div class="flex-center top-section">
	<h1>My Server List</h1>
</div>

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
			<div bind:this={guildListContainerEl} class="guild-list-container">
				{#each guildListInPage as guild, i}
					{#key guild.id}
						{#if i == 0}
							<GuildCard bind:this={guildCardEl} {guild} />
						{:else}
							<GuildCard {guild} />
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
		max-width: 1280px;
	}

	.input-container {
		padding: 4px 12px;
		display: flex;
		box-sizing: border-box;
		max-width: 200px;
	}

	.guild-list-container {
		width: 100%;
		max-width: 1280px;
		padding: 20px 20px 40px 20px;
		display: grid;
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

	@media (min-width: 1024px) {
		.guild-list-container {
			gap: 20px;
		}
	}

	@media (min-width: 1366px) {
		.guild-list-container {
			gap: 40px;
		}
	}
</style>
