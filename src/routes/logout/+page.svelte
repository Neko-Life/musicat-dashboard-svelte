<script lang="ts">
	import { goto } from '$app/navigation';
	import { removeLoggedInUser } from '$lib/utils/user';
	import { onMount } from 'svelte';

	let loader = 'Logging out...';

	onMount(() => {
		removeLoggedInUser();
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
		text-align: center;
	}
</style>
