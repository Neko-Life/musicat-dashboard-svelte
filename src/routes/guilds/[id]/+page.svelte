<script lang="ts">
	import { getWSUrl } from '$lib/utils/services';
	import { WSCon, type PlaybackInfo } from '$lib/WSCon';
	import { onMount } from 'svelte';
	import useGetMusicatUser from '$lib/queries/useGetMusicatUser';

	const musicatUser = useGetMusicatUser();

	let { params } = $props();

	// WebSocket //////////////////////////////////////

	let ws: WSCon | undefined;
	$effect(() => {
		ws = new WSCon(getWSUrl('/ws/player/' + params.id), params.id);
		(window as any).ws = ws;
		attachListeners(ws);

		// scroll to bottom
		setTimeout(
			() => document.querySelector('#bottom')?.scrollIntoView({ behavior: 'smooth' }),
			1000
		);
	});
	onMount(() => ws?.onMount());

	let nowPlaying: PlaybackInfo | undefined | null = $state();

	function attachListeners(ws: WSCon) {
		ws.on.playbackInfo = (d: PlaybackInfo) => {
			nowPlaying = d;
		};
	}

	// UI //////////////////////////////////////
	function getColorHint(n?: number, isBg?: boolean) {
		if (typeof n !== 'number') return;
		const R = (n & 0xff0000) >> 16;
		const G = (n & 0x00ff00) >> 8;
		const B = n & 0x0000ff;
		return `rgba(${R},${G},${B},${isBg ? '0.075' : '1'})`;
	}

	$effect(() => {
		document.body.style.backgroundImage = `url(${nowPlaying?.thumbnail || ''})`;
		document.body.style.setProperty(
			'--default-color-hint',
			getColorHint(nowPlaying?.color_hint) ||
				document.body.style.getPropertyValue('--default-color-hint')
		);
		document.body.style.setProperty(
			'--default-bg-color-hint',
			getColorHint(nowPlaying?.color_hint, true) ||
				document.body.style.getPropertyValue('--default-bg-color-hint')
		);
	});

	function getExpectedGPRDimension() {
		const navBarEl = document.querySelector('#top-navbar');
		if (!navBarEl) return [0, 0];

		const screenW = document.body.clientWidth;
		const screenH = window.screen.height;

		const nH = screenH - navBarEl.clientHeight;
		return [screenW > 0 ? screenW : 0, nH > 0 ? nH : 0];
	}

	let gprContainerClientWidth: number = $state(0);
	let gprContainerClientHeight: number = $state(0);
	let gprEl: HTMLDivElement | undefined;

	$effect(() => {
		if (!gprContainerClientWidth || !gprContainerClientHeight || !gprEl) return;
		const [w, h] = getExpectedGPRDimension();
		if (!w || !h) return;

		const mW = `${w}px`;
		const mH = `${h}px`;

		gprEl.style['width'] = `100vw`;
		gprEl.style['height'] = `100vh`;
		if (gprEl.style.maxWidth != mW) gprEl.style.maxWidth = mW;
		if (gprEl.style.maxHeight != mH) gprEl.style.maxHeight = mH;
	});
</script>

<div
	bind:clientWidth={gprContainerClientWidth}
	bind:clientHeight={gprContainerClientHeight}
	class="guild-player-root-container"
>
	<div bind:this={gprEl} id="guild-player-root">
		<div class="content-container">
			<div class="content glass-card">
				<div class="thumbnail-container">
					<img
						src={nowPlaying?.thumbnail || musicatUser?.data?.data?.avatar_url}
						alt="Song Thumbnail"
					/>
				</div>
				{#if !nowPlaying}
					<div class="desc-container Author-MediumItalic">
						<h2>Seems like this guild doesn't have active voice session... 🦗🦗</h2>
					</div>
				{:else}
					<div class="desc-container">
						<h1 class="desc-title Nippo-Bold">{nowPlaying.title}</h1>
						<h2 class="desc-user Author-Medium">{nowPlaying.username}</h2>
					</div>
				{/if}
			</div>
		</div>

		<div class="controls">
			<div class="progress-container">
				<div class="progress-progress">
					<div class="progress-seek"></div>
				</div>
				<div class="progress-left"></div>
			</div>
			<div class="controls-content"></div>
		</div>
	</div>
</div>

<div id="bottom"></div>

<style>
	#guild-player-root {
		display: flex;
		flex-direction: column;
	}

	.content-container {
		transition-duration: 2s;

		display: flex;
		justify-content: center;
		align-items: center;

		height: 100%;
	}

	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		text-align: center;

		max-width: 1280px;
	}

	.desc-container {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.thumbnail-container {
		height: 100%;
	}

	.thumbnail-container img {
		height: 100%;
		box-shadow: var(--default-text-color) 0 0 10px;
		border: solid 1px var(--default-text-color);
	}

	.controls {
		position: sticky;
		bottom: 0;
		height: calc(100% / 5);

		width: 100%;

		transition-duration: 2s;
		box-sizing: border-box;

		display: flex;
		flex-direction: column;
	}

	.progress-container {
		display: flex;
	}

	.progress-progress {
		width: 33%;

		box-shadow: 0px 0px 50px 8px var(--default-color-hint);
		border-top: 1px solid var(--default-color-hint);

		display: flex;
		justify-content: flex-end;

		position: relative;
	}

	.progress-seek {
		background-color: var(--default-color-hint);
		border-radius: 100%;

		position: absolute;
		transform: translateX(50%) translateY(-50%);

		max-width: 16px;
		max-height: 16px;
		width: 0vw;
		height: 0vh;

		transition-duration: 0.5s;
	}

	.controls:hover .progress-seek {
		width: 100vw;
		height: 100vh;
	}

	.progress-left {
		width: 67%;
		box-shadow: 0px 0px 50px 8px white;
		border-top: 1px solid white;
	}

	.controls-content {
		flex-grow: 1;
		background-color: var(--default-bg-color-hint);

		padding: 16px;
	}

	.glass-card {
		box-sizing: border-box;
		width: 100%;
		height: calc(100% / 3 * 2);
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			inset 0 -1px 0 rgba(255, 255, 255, 0.1),
			inset 0 0 0px 0px rgba(255, 255, 255, 0),
			0 0 100px 0 black;
		position: relative;
		overflow: hidden;
	}

	.glass-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
	}

	.glass-card::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		height: 100%;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.8),
			transparent,
			rgba(255, 255, 255, 0.3)
		);
	}

	@media screen and (min-width: 600px) {
		.content-container {
			padding: 0 12px;
		}
	}
</style>
