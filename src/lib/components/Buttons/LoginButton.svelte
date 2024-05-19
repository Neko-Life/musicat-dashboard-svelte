<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '../common/Button.svelte';

	const handleLoginClick = () => {
		const successRedir = encodeURIComponent($page.url.pathname);
		goto('/login?redirect=' + successRedir);
	};
</script>

<Button class="btn-login" on:click={handleLoginClick}>Login</Button>
