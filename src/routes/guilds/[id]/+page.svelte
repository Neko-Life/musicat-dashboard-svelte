<script lang="ts">
	import { isOnBrowser } from '$lib/utils/common';
	import { getWSUrl } from '$lib/utils/services';
	import { WSCon } from '$lib/WSCon';
	import { onMount } from 'svelte';

	let { params } = $props();

	let ws: WSCon | undefined;
	$effect(() => {
		ws = new WSCon(getWSUrl('/ws/player/' + params.id), params.id);
	});
	onMount(() => ws?.onMount());
</script>
