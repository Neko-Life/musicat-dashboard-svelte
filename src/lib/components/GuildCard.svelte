<script lang="ts">
	import type { IUserGuild } from '$lib/interfaces/services/general';
	import { getGuildIconLink } from '$lib/utils/guild';
	import { onMount } from 'svelte';
	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';

	let { guild }: { guild: IUserGuild } = $props();

	const src: string | undefined = $derived(
		guild ? getGuildIconLink({ guildId: guild.id, hash: guild.icon, size: 128 }) : undefined
	);
	const classNames: string = $derived(!guild?.is_mutual ? 'non-mutual' : '');

	let shouldSlide = $state(false);

	let descriptionContainerEl: HTMLDivElement;
	let descriptionTextEl: HTMLDivElement;

	onMount(() => {
		if (descriptionContainerEl.clientWidth >= descriptionTextEl.clientWidth) return;

		shouldSlide = true;

		return () => (shouldSlide = false);
	});
</script>

<a href="/guilds/{guild.id}" class="guild-card-container">
	<div class="guild-icon-container">
		{#if guild.has_active_voice_session}
			<div class="icon-decoration">
				<DotLottieSvelte src="anims/Voice.lottie" loop autoplay />
			</div>
		{/if}
		<div class="img-container">
			<img class={classNames} loading="lazy" {src} alt="Guild Icon" />
		</div>
	</div>

	<div bind:this={descriptionContainerEl} class="guild-card-description-container">
		<div class="guild-card-description{shouldSlide ? ' slide' : ''}">
			<div
				bind:this={descriptionTextEl}
				class="guild-card-description-text"
				title={guild.name}
			>
				{guild.name}
			</div>
		</div>
	</div>
</a>

<style>
	.guild-card-container {
		padding: 8px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 0px;
		transition-duration: 0.5s;
		cursor: pointer;
		width: 100px;
		border: 0;
		background-color: transparent;
		outline: none;
		align-items: center;
		text-decoration: none;
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
		position: relative;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.guild-card-container:hover .guild-card-description-container {
		overflow: visible;
	}

	.guild-card-description {
		position: relative;
		width: 100%;

		justify-content: center;
		display: flex;
	}

	.guild-card-description-text {
		text-align: center;
		max-height: 48px;
		font-weight: 600;
		white-space: nowrap;
		min-width: 100%;
		min-width: fit-content;
	}

	.guild-card-container:hover .guild-card-description-text {
		text-shadow:
			var(--default-text-color) 0px 0px 20px,
			red 2px 2px,
			blue 4px 4px;
		padding: 1px 6px;
		transition-duration: 0.5s;
		background-color: rgba(0, 0, 0, 0.7);
		color: var(--default-text-color);
	}

	.guild-card-description.slide {
		animation: text-container-slide 10s ease-in-out infinite alternate;
	}

	.guild-card-description.slide .guild-card-description-text {
		animation: text-slide 10s ease-in-out infinite alternate;
	}

	.guild-icon-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		aspect-ratio: 1 / 1;
		width: 100%;
	}

	.icon-decoration {
		position: absolute;
		width: calc(100% + 30%);
		height: calc(100% + 68%);
	}

	img.non-mutual {
		filter: grayscale(90%);
	}

	@media (min-width: 480px) {
		.guild-card-container {
			width: 100px;
		}
	}

	@media (min-width: 720px) {
		.guild-card-container {
			width: 120px;
			gap: 10px;
			padding: 12px;
		}

		.guild-card-description-text {
			font-size: 14px;
		}
	}

	@media (min-width: 900px) {
		.guild-card-container {
			width: 160px;
		}

		.guild-card-description-text {
			font-size: 18px;
		}
	}

	@media (min-width: 1024px) {
		.guild-card-container {
			gap: 16px;
		}
	}

	@media (min-width: 1280px) {
		.guild-card-container {
			width: 180px;
		}
	}

	@media (min-width: 1366px) {
		.guild-card-container {
			width: 180px;
		}
	}
</style>
