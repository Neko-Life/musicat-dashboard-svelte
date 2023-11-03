<script lang="ts">
	export let src: string | undefined;
</script>

<button class="avatar" on:click>
	<img loading="lazy" {src} alt="Avatar" />
</button>

<style>
	.avatar {
		background-color: transparent;
		outline: none;
		padding: 0;
		border: 0;
		overflow: hidden;
		border-radius: 999px;
		cursor: pointer;
		max-width: 48px;
		max-height: 48px;
		height: 100vh;
		width: 100vw;
		transition-duration: 0.2s;
	}

	.avatar:hover {
		scale: 105%;
	}

	.avatar:active {
		scale: 100%;
	}

	.avatar img {
		max-height: 100%;
		max-width: 100%;
	}
</style>
