<script lang="ts">
	import type { IUserGuild } from '$lib/interfaces/services/general';
	import { getGuildIconLink } from '$lib/utils/guild';

	export let guild: IUserGuild | undefined;
</script>

{#if guild}
	<button class="guild-card-container">
		<div class="img-container">
			<img
				class={!guild?.is_mutual ? 'non-mutual' : ''}
				loading="lazy"
				src={getGuildIconLink({ guildId: guild.id, hash: guild.icon, size: 128 })}
				alt="Guild Icon"
			/>
		</div>
		<div class="guild-card-description-container">
			<div class="guild-card-description">
				<div class="guild-card-description-text" title={guild.name}>
					{guild.name}
				</div>
			</div>
		</div>
	</button>
{/if}

<style>
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
                align-items: center;
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

		transition-duration: 0.5s;
		/*
		border: 1px solid transparent;
                */
	}

	/*
	.guild-card-container:hover .img-container {
		border: 1px solid white;
	}
                */

	.img-container img {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 100%;
		align-items: center;
	}

	.guild-card-description-container {
		overflow: hidden;
		height: 25px;
		width: 100%;
		display: flex;
		position: relative;
	}

	.guild-card-description {
		position: relative;
		animation: text-container-slide 10s ease-in-out infinite alternate;
		width: 100%;
	}

	.guild-card-description-text {
		text-align: center;
		max-height: 48px;
		font-size: 18px;
		font-weight: 600;
		white-space: nowrap;
		min-width: 100%;
		width: fit-content;
		position: absolute;
		animation: text-slide 10s ease-in-out infinite alternate;
	}

	img.non-mutual {
		filter: grayscale(90%);
	}
</style>
