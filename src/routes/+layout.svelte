<!-- Providers and app layout here -->
<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import Navbar from '$lib/components/Navbar.svelte';
	import { hideNavbar, updateUser } from '$lib/store';
	import { onMount } from 'svelte';
	import RootHook from '$lib/components/RootHook.svelte';

	// load user from local storage
	onMount(() => {
		updateUser();
	});

	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<RootHook />
	<Navbar hidden={$hideNavbar} />
	<slot />
</QueryClientProvider>
