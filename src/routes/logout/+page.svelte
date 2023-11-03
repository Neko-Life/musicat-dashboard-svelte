<script lang="ts">
	import { goto } from '$app/navigation';
	import { removeStorage } from '$lib/utils/localStorage';
	import { onMount } from 'svelte';

	let loader = 'Logging out...';

	onMount(() => {
		removeStorage('user');
		goto('/');
	});

	// !TODO: notify backend? maybe no need for now
</script>

<div class="page-container">
	<h1>{loader}</h1>
</div>

<style>
	.page-container {
		display: flex;
		flex-grow: 1;
		justify-content: center;
		align-items: center;
	}
</style>
