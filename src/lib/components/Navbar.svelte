<script lang="ts">
	import Button from './common/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const successRedir = encodeURIComponent($page.url.pathname);

	const handleLoginClick = () => {
		goto('/login?redirect=' + encodeURIComponent(successRedir));
	};
</script>

<div id="top-navbar">
	<div class="btn-login-container">
		<Button class="btn-login" on:click={handleLoginClick}>Login</Button>
	</div>
</div>

<style>
	#top-navbar {
		position: fixed;
		width: 100%;
		box-sizing: border-box;
		top: 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 24px;
	}

	.btn-login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0px 24px;
	}
</style>
