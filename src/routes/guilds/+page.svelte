<script lang="ts">
	import GuildCard from '$lib/components/GuildCard.svelte';
	import useGetUserGuilds from '$lib/queries/useGetUserGuilds';
	import { user } from '$lib/store';

	let userGuilds: ReturnType<typeof useGetUserGuilds>;
	$: userGuilds = useGetUserGuilds({ enabled: !!$user });
</script>

<div class="flex-center">
	<h1>My Server List</h1>
</div>

{#if $userGuilds.isError}
	<div class="error-container">Error getting guilds</div>
{:else if $userGuilds.isLoading}
	<div class="error-container">Loading...</div>
{:else}
	<div class="page-container">
		<div class="guild-list-container">
			{#each $userGuilds.data?.data?.sort((a, b) => {
				if (a.is_mutual && !b.is_mutual) return -1;
				if (!a.is_mutual && b.is_mutual) return 1;

				return 0;
			}) || [] as guild, i}
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
