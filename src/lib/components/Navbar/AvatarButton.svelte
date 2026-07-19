<script lang="ts">
	let { src, ...props }: { src?: string; [k: string]: any } = $props();
</script>

<button class="avatar {props.class || ''}" on:click>
	<img loading="lazy" {src} alt="Avatar" />
</button>

<style>
	.avatar {
		background-color: transparent;
		outline: none;
		padding: 0;
		border: 0;
		overflow: hidden;
		border-radius: 100%;
		cursor: pointer;
		max-width: 48px;
		max-height: 48px;
		height: 100vh;
		width: 100vw;
		transition-duration: 0.2s;
		z-index: 1;
	}

	.avatar:hover {
		scale: 105%;
		filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.5));
	}

	.avatar:active {
		scale: 100%;
	}

	.avatar img {
		max-height: 100%;
		max-width: 100%;
	}
</style>
