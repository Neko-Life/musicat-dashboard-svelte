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
		// keep previous style
		if (!nowPlaying) return;
		document.body.style.backgroundImage = `url(${nowPlaying.thumbnail || ''})`;
		document.body.style.setProperty(
			'--default-color-hint',
			getColorHint(nowPlaying.color_hint) ||
				document.body.style.getPropertyValue('--default-color-hint')
		);
		document.body.style.setProperty(
			'--default-bg-color-hint',
			getColorHint(nowPlaying.color_hint, true) ||
				document.body.style.getPropertyValue('--default-bg-color-hint')
		);
	});

	function getExpectedGPRDimension() {
		const navBarEl: HTMLElement | null = document.querySelector('#top-navbar');
		if (!navBarEl) return [0, 0];

		const screenW = document.body.clientWidth;
		const screenH = window.visualViewport?.height || 0;

		const nH = screenH - navBarEl.offsetHeight;
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
						<h2>Seems like this guild doesn't have an active voice session... 🦗🦗</h2>
					</div>
				{:else}
					<div class="desc-container">
						<h1 class="desc-title Nippo-Bold">{nowPlaying.title}</h1>
						<h2 class="desc-user Author-Medium">{nowPlaying.username}</h2>
					</div>
				{/if}
			</div>
		</div>

		<div class="controls-container">
			<div class="controls">
				<div class="progress-container">
					<div class="progress-progress">
						<div class="progress-seek"></div>
					</div>
					<div class="progress-left"></div>
				</div>
				<div class="controls-content">
					<div class="control-container">EQUALIZER</div>
					<div class="play-seek-container">
						<div class="seek prev">
							<div class="icon">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
									><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
										d="M160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160C96 124.7 124.7 96 160 96z"
									/></svg
								>
							</div>
						</div>
						<div class="play-stop play">
							<div class="icon">
								{#if nowPlaying}
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
										><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
											d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"
										/></svg
									>
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
										><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
											d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
										/></svg
									>
								{/if}
							</div>
						</div>
						<div class="play-stop stop">
							<div class="icon">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
									><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
										d="M160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160C96 124.7 124.7 96 160 96z"
									/></svg
								>
							</div>
						</div>
						<div class="seek next">
							<div class="icon">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
									><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
										d="M83.8 541.6C95.8 546.6 109.5 543.8 118.7 534.7L288 365.3L288 512C288 524.9 295.8 536.6 307.8 541.6C319.8 546.6 333.5 543.8 342.7 534.7L512 365.3L512 512C512 529.7 526.3 544 544 544C561.7 544 576 529.7 576 512L576 128C576 110.3 561.7 96 544 96C526.3 96 512 110.3 512 128L512 274.7L342.6 105.3C333.4 96.1 319.7 93.4 307.7 98.4C295.7 103.4 288 115.1 288 128L288 274.7L118.6 105.4C109.4 96.2 95.7 93.5 83.7 98.5C71.7 103.5 64 115.1 64 128L64 512C64 524.9 71.8 536.6 83.8 541.6z"
									/></svg
								>
							</div>
						</div>
					</div>
					<div class="volume-container">VOLUME</div>
				</div>
			</div>
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

		max-width: max(1280px, calc(100vw / 3 * 2));
	}

	.desc-container {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.thumbnail-container {
		max-width: 100%;
		width: 100%;

		flex-grow: 1;
	}

	.thumbnail-container img {
		height: 100%;
		max-width: 100%;
		object-fit: contain;

		box-shadow: var(--default-text-color) 0 0 10px;
		border: solid 1px var(--default-text-color);
	}

	.controls-container {
		position: sticky;
		bottom: 0;
		height: calc(100% / 6);

		width: 100%;

		box-sizing: border-box;
	}

	.controls {
		display: flex;
		flex-direction: column;

		position: relative;
		height: 100%;
	}

	.progress-container {
		display: flex;
	}

	.controls-content,
	.progress-container * {
		transition-duration: 10s;
	}

	.progress-progress {
		width: 33%;

		box-shadow: 0px 0px 50px 8px var(--default-color-hint);
		background-color: var(--default-color-hint);
		height: 1px;

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
		/* height: 100vh; */
	}

	.progress-left {
		width: 67%;
		box-shadow: 0px 0px 50px 8px white;
		background-color: white;
		height: 1px;
	}

	.controls-content {
		flex-grow: 1;
		background-color: var(--default-bg-color-hint);

		padding: 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		position: relative;
		max-height: 100%;
		box-sizing: border-box;
	}

	.controls-content > div {
		height: 100%;

		display: flex;
		gap: 24px;
	}

	.play-seek-container {
		justify-content: center;
		align-items: center;
	}

	.play-seek-container > div {
		aspect-ratio: 1 / 1;

		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 100%;
		background-color: white;
	}

	.play-seek-container > .seek {
		height: 50%;
	}

	.play-seek-container > .play-stop {
		height: 75%;
	}

	.glass-card {
		box-sizing: border-box;
		width: 100%;
		min-height: calc(100% / 5 * 4);
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
