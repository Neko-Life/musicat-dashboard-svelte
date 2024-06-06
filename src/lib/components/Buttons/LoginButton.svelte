<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '../common/Button.svelte';
	import { createLoginRedirectParam } from '$lib/utils/url';

	const handleLoginClick = () => {
		goto('/login?' + createLoginRedirectParam($page.url.pathname));
	};
</script>

<Button class="btn-login" on:click={handleLoginClick}>Login</Button>
