<script lang="ts">
	import { onMount } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	export let onOuterClick: MouseEventHandler<HTMLDivElement> | undefined;

	let containerEl: HTMLDivElement;

	const isElementOrChildOf = (parent: HTMLElement, child: HTMLElement | null): boolean => {
		if (!parent || !child) return false;

		return parent === child || isElementOrChildOf(parent, child.parentElement);
	};

	const handler = (e: MouseEvent) => {
		if (isElementOrChildOf(containerEl, e.target as HTMLElement)) {
			return;
		}

		onOuterClick?.(e as MouseEvent & { currentTarget: EventTarget & HTMLDivElement });
	};

	onMount(() => {
		document.body.addEventListener('click', handler);

		// unmount handler
		return () => {};
	});
</script>

<div bind:this={containerEl} {...$$props}>
	<slot />
</div>
