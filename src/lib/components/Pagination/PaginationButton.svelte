<script lang="ts">
	import Button from '../common/Button.svelte';
	import { pagination } from '$lib/store';
	import type { KeyboardEventHandler } from 'svelte/elements';

	let {
		index = 0,
		inputPage = false,
		onPageClick,
		additionalClass = ''
	}: {
		// 0-based
		index?: number;
		inputPage?: boolean;
		additionalClass?: string;

		/**
		 * Should return 0 if continue, 1 if return after call
		 */
		onPageClick?: (page: number) => 0 | 1;
	} = $props();
	let inputPageValue = $state('');

	const handlePaginationClick = (page: number) => {
		if (!$pagination || onPageClick?.(page)) return;

		if (!onlyInputPage && $pagination.page !== page) {
			$pagination.page = page;
			return;
		}

		inputPage = true;
	};

	const handleInputPageKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (['Enter'].includes(e.key)) {
			// submit
			if (!$pagination) return;

			const pageN = inputPageValue?.length > 0 ? parseInt(inputPageValue) : NaN;
			if (Number.isNaN(pageN) || pageN < 1 || pageN > $pagination.maxPage) return;

			$pagination.page = pageN;

			resetInputPage();
		} else if (['Escape', 'Meta'].includes(e.key)) {
			resetInputPage();
		}
	};

	const resetInputPage = () => {
		inputPageValue = '';
		inputPage = false;
	};

	const noInputPage = $derived(index === -1);
	const onlyInputPage = $derived(index === -2);
	const onlyInputShouldRenderPage = $derived(
		$pagination &&
			onlyInputPage &&
			$pagination.page > 2 &&
			$pagination.page < $pagination.maxPage - 1
	);
</script>

{#if $pagination !== undefined}
	<div class="pagination-button {additionalClass}">
		{#if !noInputPage && (onlyInputPage || $pagination.page === index + 1) && inputPage}
			<div class="btn input-container default-inp">
				<input
					class="input-page"
					placeholder="Page"
					on:keydown={handleInputPageKeydown}
					on:blur={resetInputPage}
					bind:value={inputPageValue}
					autofocus
				/>
			</div>
		{/if}

		<Button
			class="pagination{onlyInputShouldRenderPage || $pagination.page === index + 1
				? ' active'
				: ''}"
			on:click={() => handlePaginationClick(index + 1)}
		>
			{#if onlyInputPage}
				{#if onlyInputShouldRenderPage}
					{$pagination.page}
				{:else}
					. .
				{/if}
			{:else if !noInputPage}
				{index + 1}
			{/if}

			<slot />
		</Button>
	</div>
{/if}

<style>
	.pagination-button {
		grid-row: 1;
		position: relative;
		--btn-padding: 8px;
	}

	.input-page {
		box-sizing: border-box;
		font-size: 14px;
		max-height: 100%;
		height: 100%;
		max-width: 100%;
		padding: 0px 8px;
		animation: inp-page 0.3s ease-out;
	}

	.input-container {
		transform: translateX(-50%);
		left: 55%;
		box-sizing: border-box;
		position: absolute;
		display: flex;
		max-height: 100%;
		height: 100%;
		scale: 105%;
		z-index: 1;
		max-width: 54px;
		animation: max-width-expand 0.3s ease-out;
	}

	@keyframes inp-page {
		0% {
			padding: 0px 0px;
		}

		100% {
			padding: 0px 8px;
		}
	}

	@keyframes max-width-expand {
		0% {
			max-width: 0px;
		}

		100% {
			max-width: 54px;
		}
	}
</style>
