<script lang="ts">
	import GuildCard from '$lib/components/GuildCard.svelte';
	import type { IUserGuild } from '$lib/interfaces/services/general';
	import useGetUserGuilds from '$lib/queries/useGetUserGuilds';
	import { user, pagination } from '$lib/store';
	import { onMount } from 'svelte';

	let search = '';
	const perPage = 10;

	const userGuilds = useGetUserGuilds({ enabled: !!$user });
	$: userGuilds.setEnabled(!!$user);

	let guildList: IUserGuild[];
	let guildListInPage: typeof guildList;
	$: {
		if (!$pagination) {
			$pagination = {
				page: 1,
				maxPage: 1
			};
		}

		const filterIndexes = perPage * $pagination.page;
		const searchLowCase = search.toLocaleLowerCase();

		guildList =
			$userGuilds.data?.data
				?.filter((v) =>
					search.length ? v.name.toLocaleLowerCase().includes(searchLowCase) : true
				)
				.sort((a, b) => {
					if (a.is_mutual && !b.is_mutual) return -1;
					if (!a.is_mutual && b.is_mutual) return 1;

					return 0;
				}) || [];

		$pagination.maxPage = (guildList.length && Math.ceil(guildList.length / perPage)) || 1;
		guildListInPage = guildList.filter(
			(_v, i) => i >= filterIndexes - perPage && i < filterIndexes
		);
	}

	onMount(() => () => {
		$pagination = undefined;
	});
</script>

<div class="flex-center top-section">
	<h1>My Server List</h1>
</div>

<div class="page-container">
	<div class="content">
		{#if !$user}
			<div class="error-container login-container">You're not logged in</div>
		{:else if $userGuilds.isError}
			<div class="error-container">Error getting guilds</div>
		{:else if $userGuilds.isLoading}
			<div class="error-container">Loading...</div>
		{:else}
			<div class="top-content">
				<div class="input-container default-inp">
					<input bind:value={search} />
				</div>
			</div>
			<div class="guild-list-container">
				{#each guildListInPage as guild}
					{#key guild.id}
						<GuildCard {guild} />
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
		grid-template-columns: repeat(3, 1fr);
		box-sizing: border-box;
	}

	.top-section {
		position: relative;
	}

	@media (min-width: 480px) {
		.guild-list-container {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (min-width: 720px) {
		.guild-list-container {
			grid-template-columns: repeat(5, 1fr);
			gap: 8px;
		}
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
