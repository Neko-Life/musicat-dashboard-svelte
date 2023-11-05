<script lang="ts">
	import GuildCard from '$lib/components/GuildCard.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import useGetUserGuilds from '$lib/hooks/useGetUserGuilds';

	const userGuilds = useGetUserGuilds();
</script>

<Navbar />

{#if $userGuilds.isError}
	<div class="error-container">Error getting guilds</div>
{:else if $userGuilds.isLoading}
	<div class="error-container">Loading...</div>
{:else}
	<div class="page-container">
		<div class="guild-list-container">
			{#each $userGuilds.data?.data || [] as guild, i}
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
		padding: 40px 20px;
	}
</style>
