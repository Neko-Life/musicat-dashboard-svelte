<script lang="ts">
	import { getWSUrl } from '$lib/utils/services';
	import { WSCon, type PlaybackInfo } from '$lib/WSCon';
	import { onMount } from 'svelte';

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
		<div class="content">
			<div class="thumbnail-container glass-card">
				<img src={nowPlaying?.thumbnail} alt="Song Thumbnail" />
			</div>
		</div>

		<div class="controls"></div>
	</div>
</div>

<div id="bottom"></div>

<style>
	#guild-player-root {
		display: flex;
		flex-direction: column;
	}

	.content {
		transition-duration: 2s;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.thumbnail-container {
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 1280px;
	}

	.thumbnail-container img {
		height: 100%;
	}

	.controls {
		position: sticky;
		bottom: 0;
		height: calc(100% / 5);

		width: 100%;

		transition-duration: 2s;
		box-sizing: border-box;
		display: flex;
		padding: 16px;

		box-shadow: 0px 0px 50px 0 var(--default-color-hint);
		background-color: var(--default-bg-color-hint);
		border-top: 1px solid var(--default-color-hint);
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
		.content {
			padding: 0 12px;
		}
	}
</style>
