<script lang="ts">
	import { getWSUrl } from '$lib/utils/services';
	import { WSCon, type PlaybackInfo } from '$lib/WSCon';
	import { onMount } from 'svelte';
	import useGetMusicatUser from '$lib/queries/useGetMusicatUser';
	import OuterClick from '$lib/components/Hooks/OuterClick.svelte';

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

	function orientationChangeHandler() {
		setTimeout(calcGPRDimension, 100);
	}
	onMount(() => {
		const wsUnmount = ws?.onMount();
		window.screen.orientation.addEventListener('change', orientationChangeHandler);

		return () => {
			window.screen.orientation.removeEventListener('change', orientationChangeHandler);
			wsUnmount?.();
		};
	});

	// let delayNowPlaying: PlaybackInfo | undefined | null = $state();
	let nowPlaying: PlaybackInfo | undefined | null = $state();
	let timeRelative: number = $state(0);
	let stopped = false;

	function attachListeners(ws: WSCon) {
		ws.on.playbackInfo = (d: PlaybackInfo) => {
			nowPlaying = d;
			// if (!nowPlaying) nowPlaying = d;
			// else delayNowPlaying = nowPlaying;

			updateProgress({
				base: nowPlaying?.progress,
				rel: 0,
				total: nowPlaying?.duration
			});
		};

		ws.on.stop = () => {
			stopped = true;
		};

		ws.on.play = () => {
			stopped = false;
		};

		ws.on.seek = (ms: number) => {
			if (!nowPlaying) return;
			nowPlaying.progress = ms - timeRelative;
		};

		ws.on.audioStopped = () => {
			if (!stopped) {
				// if (delayNowPlaying) {
				// 	nowPlaying = delayNowPlaying;
				// 	delayNowPlaying = null;
				// }
				return;
			}
			nowPlaying = null;
		};

		ws.on.audioTimeUpdate = (audioEl: HTMLAudioElement) => {
			const newRel = audioEl.currentTime * 1000;
			timeRelative = newRel;

			updateProgress({
				base: nowPlaying?.progress,
				rel: newRel,
				total: nowPlaying?.duration
			});
		};
	}

	// UI //////////////////////////////////////

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

	function calcGPRDimension() {
		if (!gprEl) return;
		const [w, h] = getExpectedGPRDimension();
		if (!w || !h) return;

		const mW = `${w}px`;
		const mH = `${h}px`;

		gprEl.style['width'] = `100vw`;
		gprEl.style['height'] = `100vh`;
		if (gprEl.style.maxWidth != mW) gprEl.style.maxWidth = mW;
		if (gprEl.style.maxHeight != mH) gprEl.style.maxHeight = mH;
	}

	$effect(() => {
		if (!gprContainerClientWidth || !gprContainerClientHeight || !gprEl) return;
		calcGPRDimension();
	});

	function pad0(n: number) {
		const s = n.toString();
		return s.length < 2 ? '0' + s : s;
	}

	function msToDisplay(ms: number) {
		const second = ms / 1000;
		const minute = Math.floor(second / 60);
		const secondReminder = Math.floor(second % 60);
		return `${pad0(minute)}:${pad0(secondReminder)}`;
	}

	let progressEl: HTMLDivElement | null;
	let progressNbEl: HTMLDivElement | null;
	let progressNbLeftEl: HTMLDivElement | null;

	function updateProgress({ base, rel, total }: { base?: number; rel: number; total?: number }) {
		updateProgressNb({ base, rel, total });
		updateProgressNbLeft({ base, rel, total });
		if (!progressEl) return;
		if (!total) {
			progressEl.style.width = '0%';
			return;
		}
		const uBase = base || 0;

		progressEl.style.width = `${((uBase + rel) / total) * 100}%`;
	}

	function updateProgressNb({
		base,
		rel,
		total
	}: {
		base?: number;
		rel: number;
		total?: number;
	}) {
		if (!progressNbEl) return;
		if (!total) {
			progressNbEl.textContent = '--:--/--:--';
			return;
		}

		const uBase = base || 0;
		const curMs = uBase + rel;

		const s = msToDisplay(curMs);
		if (s === progressNbEl.textContent.split('/')[0]) return;
		progressNbEl.textContent = s + '/' + msToDisplay(total);
	}

	function updateProgressNbLeft({
		base,
		rel,
		total
	}: {
		base?: number;
		rel: number;
		total?: number;
	}) {
		if (!progressNbLeftEl) return;
		if (!total) {
			progressNbLeftEl.textContent = '--:--';
			return;
		}

		const uBase = base || 0;
		const curMs = uBase + rel;
		const totalRemain = total - curMs;

		const s = '-' + msToDisplay(totalRemain);
		if (s === progressNbLeftEl.textContent) return;
		progressNbLeftEl.textContent = s;
	}

	let volume: number = $state(1000000);
	let muted: boolean = $state(false);
	function handleVolumeChange(e: { target: EventTarget | HTMLInputElement | null }) {
		if (!(e.target instanceof HTMLInputElement) || !e.target?.value) return;
		const val = Number(e.target.value);
		if (Number.isNaN(val)) return;
		ws?.setVolume(val / 1000000);
		volume = val;
	}

	function toggleMute() {
		muted = !!ws?.toggleMute();
	}

	let showMobileVolumeInput: boolean = $state(true);
	function toggleMobileVolumeInput(e: Event) {
		console.log(e);
		e.preventDefault();
		e.stopPropagation();
		showMobileVolumeInput = !showMobileVolumeInput;
	}
</script>

{#snippet inpVolume()}
	<input
		oninput={handleVolumeChange}
		type="range"
		id="volume"
		name="volume"
		min="0"
		max="1000000"
		defaultvalue={1000000}
	/>
{/snippet}

{#snippet btnVolume(onclick: (e: Event) => void)}
	<button class="btn-nostyle volume-label" {onclick}>
		{#if muted || (volume || 0) === 0}
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
				><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
					d="M80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416zM399 239C389.6 248.4 389.6 263.6 399 272.9L446 319.9L399 366.9C389.6 376.3 389.6 391.5 399 400.8C408.4 410.1 423.6 410.2 432.9 400.8L479.9 353.8L526.9 400.8C536.3 410.2 551.5 410.2 560.8 400.8C570.1 391.4 570.2 376.2 560.8 366.9L513.8 319.9L560.8 272.9C570.2 263.5 570.2 248.3 560.8 239C551.4 229.7 536.2 229.6 526.9 239L479.9 286L432.9 239C423.5 229.6 408.3 229.6 399 239z"
				/></svg
			>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
				><!--!Font Awesome Pro v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2026 Fonticons, Inc.--><path
					d="M112 416L160 416L294.1 535.2C300.5 540.9 308.7 544 317.2 544C336.4 544 352 528.4 352 509.2L352 130.8C352 111.6 336.4 96 317.2 96C308.7 96 300.5 99.1 294.1 104.8L160 224L112 224C85.5 224 64 245.5 64 272L64 368C64 394.5 85.5 416 112 416zM505.1 171C494.8 162.6 479.7 164.2 471.3 174.5C462.9 184.8 464.5 199.9 474.8 208.3C507.3 234.7 528 274.9 528 320C528 365.1 507.3 405.3 474.8 431.8C464.5 440.2 463 455.3 471.3 465.6C479.6 475.9 494.8 477.4 505.1 469.1C548.3 433.9 576 380.2 576 320.1C576 260 548.3 206.3 505.1 171.1zM444.6 245.5C434.3 237.1 419.2 238.7 410.8 249C402.4 259.3 404 274.4 414.3 282.8C425.1 291.6 432 305 432 320C432 335 425.1 348.4 414.3 357.3C404 365.7 402.5 380.8 410.8 391.1C419.1 401.4 434.3 402.9 444.6 394.6C466.1 376.9 480 350.1 480 320C480 289.9 466.1 263.1 444.5 245.5z"
				/></svg
			>
		{/if}
	</button>
{/snippet}

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
				{#if !nowPlaying?.title}
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
				<div class="progress-container-container">
					<div class="progress-container">
						<div bind:this={progressEl} class="progress-progress">
							<div class="progress-seek">
								<div class="seek-hover">
									<button
										aria-label="Seek Button"
										class="btn-nostyle seek-btn"
										onclick={console.log}
									></button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="controls-content">
					<div class="side-container control-container">
						<div bind:this={progressNbEl} class="progress-nb">--:--/--:--</div>
						<!-- <div>EQUALIZER</div> -->
					</div>
					<div class="play-seek-container">
						<div class="seek prev">
							<div class="icon">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
									><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
										d="M556.2 541.6C544.2 546.6 530.5 543.8 521.3 534.7L352 365.3L352 512C352 524.9 344.2 536.6 332.2 541.6C320.2 546.6 306.5 543.8 297.3 534.7L128 365.3L128 512C128 529.7 113.7 544 96 544C78.3 544 64 529.7 64 512L64 128C64 110.3 78.3 96 96 96C113.7 96 128 110.3 128 128L128 274.7L297.4 105.4C306.6 96.2 320.3 93.5 332.3 98.5C344.3 103.5 352 115.1 352 128L352 274.7L521.4 105.3C530.6 96.1 544.3 93.4 556.3 98.4C568.3 103.4 576 115.1 576 128L576 512C576 524.9 568.2 536.6 556.2 541.6z"
									/></svg
								>
							</div>
						</div>
						<div class="play-stop play">
							<div class="icon">
								{#if nowPlaying?.title}
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
					<div class="side-container right-container">
						<div bind:this={progressNbLeftEl} class="progress-nb progress-nb-left">
							--:--
						</div>
						<div>
							<div class="volume-container">
								<label for="volume">{@render btnVolume(toggleMute)}</label>
								{@render inpVolume()}
							</div>

							<div class="volume-container mobile">
								{@render btnVolume(toggleMobileVolumeInput)}
								{#if showMobileVolumeInput}
									<div class="popup-mobile-volume-container">
										<OuterClick
											onOuterClick={showMobileVolumeInput
												? toggleMobileVolumeInput
												: undefined}
										>
											<div class="popup-mobile-volume">
												{@render btnVolume(toggleMute)}
												{@render inpVolume()}
											</div>
										</OuterClick>
									</div>
								{/if}
							</div>
						</div>
					</div>
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

	.guild-player-root-container {
		height: 100%;
	}

	.content-container {
		transition-duration: 2s;

		display: flex;
		justify-content: center;
		align-items: center;

		height: 100%;
		max-height: calc(100% - 82px);
	}

	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;

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
		height: 100%;
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
		min-height: 82px;
		width: 100%;

		box-sizing: border-box;
	}

	.controls-container * {
		transition-duration: 0.1s, 10s, 10s;
		transition-property: all, box-shadow, background-color;
	}

	.controls {
		display: flex;
		flex-direction: column;

		position: relative;
		height: 100%;
	}

	.progress-container-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.progress-container {
		display: flex;
		z-index: 1;
		box-shadow: 0px 0px 50px 8px white;
		background-color: white;

		position: absolute;
		width: 100%;
		left: 0;
	}

	.progress-progress {
		width: 0%;

		box-shadow: 0px 0px 50px 8px var(--default-color-hint);
		background-color: var(--default-color-hint);
		height: 1px;

		display: flex;
		justify-content: flex-end;
		align-items: center;

		position: relative;
	}

	.controls:hover .progress-progress {
		height: 4px;
	}

	.progress-seek {
		position: absolute;
		transform: translateX(50%);
		pointer-events: none;
	}

	.seek-btn {
		background-color: var(--default-color-hint);
		border-radius: 100%;

		max-width: 16px;
		max-height: 16px;
		width: 0px;
		height: 0px;
	}

	.seek-hover {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 60px;
		height: 60px;
		pointer-events: all;
	}

	.controls:hover .seek-btn,
	.seek-hover:hover .seek-btn {
		width: 16px;
		height: 16px;
		pointer-events: all;
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
	}

	.side-container {
		flex-direction: column;
		gap: 8px;
		width: 100%;
	}

	.volume-container,
	.right-container > div {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
	}

	.volume-container {
		display: none;
	}

	.volume-container.mobile {
		display: flex;
	}

	.popup-mobile-volume-container {
		position: absolute;
		border-radius: 8px;

		transform: rotate(-90deg) translateX(60%) translateY(200%);
		background-color: var(--default-bg-body);
		z-index: 1;
	}

	.popup-mobile-volume {
		padding: 8px 16px;
		display: flex;
		gap: 12px;
	}

	.popup-mobile-volume .volume-label {
		transform: rotate(90deg);
	}

	.play-seek-container {
		justify-content: center;
		align-items: center;
		gap: 4px;
		--svg-fill: var(--default-bg-body);
	}

	.play-seek-container > div {
		aspect-ratio: 1 / 1;

		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 100%;
		background-color: white;
	}

	.play-seek-container .icon {
		aspect-ratio: 1 / 1;
		height: 50%;
	}

	.play-seek-container > .seek {
		height: 50%;
		min-height: 36px;
	}

	.play-seek-container > .play-stop {
		height: 75%;
		min-height: 50px;
	}

	label[for='volume'] {
		display: flex;
	}

	.volume-label {
		width: 24px;
		height: 24px;
		--svg-fill: var(--default-text-color);
	}

	.glass-card {
		box-sizing: border-box;
		width: 100%;
		height: calc(100% / 5 * 4);
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

	@media screen and (min-width: 720px) {
		.play-seek-container {
			gap: 24px;
		}

		.volume-container {
			display: flex;
		}

		.volume-container.mobile {
			display: none;
		}
	}

	@media screen and (min-height: 720px) {
		.thumbnail-container {
			width: 100%;
			flex-grow: 1;
		}

		.content {
			flex-direction: column;
		}
	}
</style>
