<script lang="ts">
	import GuildCard from '$lib/components/GuildCard.svelte';
	import type { IUserGuild } from '$lib/interfaces/services/general';
	import useGetUserGuilds from '$lib/queries/useGetUserGuilds';
	import { user } from '$lib/store';

	let page = 1;
	const perPage = 10;
	const filterIndexes = perPage * page;

	const userGuilds = useGetUserGuilds({ enabled: !!$user });
	$: userGuilds.setEnabled(!!$user);

	let guildList: IUserGuild[];
	let guildListInPage: typeof guildList;
	let guildListRows: (typeof guildList)[];
	let maxPage = 1;
	const perRow = 5;
	$: {
		guildList =
			$userGuilds.data?.data?.sort((a, b) => {
				if (a.is_mutual && !b.is_mutual) return -1;
				if (!a.is_mutual && b.is_mutual) return 1;

				return 0;
			}) || [];

		maxPage = (guildList.length && Math.ceil(guildList.length / perPage)) || 1;
		guildListInPage = guildList.filter(
			(_v, i) => i >= filterIndexes - perPage && i < filterIndexes
		);
		guildListRows = [];
		const iter = Math.ceil(perPage / perRow);
		for (let i = 0; i < iter; i++) {
			const toP = [];
			const startj = perRow * i;
			for (let j = startj; j < startj + perRow; j++) {
				const g = guildList[j];
				if (!g) break;
				toP.push(g);
			}
			guildListRows.push(toP);
		}
	}
</script>

{#if !$user}
	<div class="error-container login-container">You're not logged in</div>
{:else if $userGuilds.isError}
	<div class="error-container">Error getting guilds</div>
{:else if $userGuilds.isLoading}
	<div class="error-container">Loading...</div>
{:else}
	<div class="flex-center">
		<h1>My Server List</h1>
	</div>

	<div class="page-container">
		<div class="guild-list-container">
			{#each guildListRows as guildRow}
				<div class="guild-row">
					{#each guildRow as guild}
						<GuildCard {guild} />
					{/each}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.error-container,
	.page-container {
		display: flex;
		flex-grow: 1;
		justify-content: center;
	}

	.error-container {
		align-items: center;
		font-size: 36px;
	}

	.guild-list-container {
		width: 100%;
		max-width: 1280px;
		padding: 20px 20px 40px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
	}

	.guild-row {
		display: flex;
	}
</style>
