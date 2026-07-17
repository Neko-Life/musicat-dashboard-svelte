<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout } from '$lib/utils/user';
	import { onMount } from 'svelte';

	let loader = 'Logging out...';

	onMount(() => {
		logout().finally(() => goto('/'));
	});
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
