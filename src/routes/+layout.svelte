<!-- Providers and app layout here -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import Navbar from '$lib/components/Navbar.svelte';
	import { hideNavbar, updateUser } from '$lib/store';
	import { onMount } from 'svelte';
	import RootHook from '$lib/components/RootHook.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	// load user from local storage
	onMount(() => {
		updateUser();
	});

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<RootHook />
	<Navbar hidden={$hideNavbar} />
	<slot />
	<Pagination />
</QueryClientProvider>
