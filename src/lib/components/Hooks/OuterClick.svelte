<script lang="ts">
	import { onMount } from 'svelte';

	let {
		onOuterClick,
		...props
	}: { onOuterClick: ((e: MouseEvent) => void) | undefined; [k: string]: any } = $props();

	let containerEl: HTMLDivElement;

	const isElementOrChildOf = (parent: HTMLElement, child: HTMLElement | null): boolean => {
		if (!parent || !child) return false;

		return parent === child || isElementOrChildOf(parent, child.parentElement);
	};

	const handler = (e: MouseEvent) => {
		if (isElementOrChildOf(containerEl, e.target as HTMLElement)) {
			return;
		}

		onOuterClick?.(e);
	};

	onMount(() => {
		document.body.addEventListener('click', handler);

		// unmount handler
		return () => {
			document.body.removeEventListener('click', handler);
		};
	});
</script>

<div bind:this={containerEl} {...props}>
	<slot />
</div>

<style>
	.flexcolg0 {
		display: flex;
		flex-direction: column;
		gap: 0px;
	}
</style>
