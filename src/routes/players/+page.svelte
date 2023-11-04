<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import useGetUserGuilds from '$lib/hooks/useGetUserGuilds';
	import { getGuildIconLink } from '$lib/utils/guild';

	const userGuilds = useGetUserGuilds();
</script>

<Navbar />

{#if $userGuilds.isError}
	<div class="error-container">Error getting guilds</div>
{:else}
	<div class="page-container">
		<div class="guild-list-container">
			{#each $userGuilds.data?.data || [] as guild, i}
				<button class="guild-card-container">
					<div class="img-container">
						<img
							loading="lazy"
							src={getGuildIconLink({ guildId: guild.id, hash: guild.icon, size: 128 })}
							alt="Guild Icon"
						/>
					</div>
					<div class="guild-card-description">
						{guild.name}
					</div>
				</button>
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
	}

	.guild-list-container {
		max-width: 1366px;
		flex-wrap: wrap;
		gap: 20px;
		padding: 40px 20px;
	}

	.guild-card-container {
		padding: 20px;
		box-sizing: border-box;
		width: 200px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		transition-duration: 0.5s;
                cursor: pointer;

		border: 0;
		background-color: transparent;
		outline: none;
	}

	.guild-card-container:hover {
		scale: 105%;
		z-index: 1;
		filter: drop-shadow(0px 0px 30px rgba(255, 255, 255, 0.5));
	}

	.guild-card-container:active {
		scale: 100%;
	}

	.img-container {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 999px;
		overflow: hidden;
		width: 100%;
		aspect-ratio: 1/1;
	}

	.img-container img {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 100%;
		align-items: center;
	}

	.guild-card-description {
		text-align: center;
		max-height: 46px;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 18px;
	}
</style>
