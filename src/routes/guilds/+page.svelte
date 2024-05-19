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
	let maxPage = 1;
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
			{#each guildListInPage as guild, i}
				<GuildCard {guild} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.error-container,
	.page-container,
	.guild-list-container {
		display: flex;
		flex-grow: 1;
		justify-content: center;
	}

	.error-container {
		align-items: center;
		font-size: 36px;
	}

	.guild-list-container {
		max-width: 1366px;
		flex-wrap: wrap;
		gap: 20px;
		padding: 20px 20px 40px 20px;
	}
</style>
