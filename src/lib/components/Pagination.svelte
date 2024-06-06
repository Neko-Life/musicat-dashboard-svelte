<script lang="ts">
	import { pagination } from '$lib/store';
	import type { KeyboardEventHandler } from 'svelte/elements';
	import Button from './common/Button.svelte';

	let inputPage = false;
	let inputPageValue = '';
	const handlePaginationClick = (page: number) => {
		if (!$pagination) return;

		if ($pagination.page !== page) {
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
</script>

{#if $pagination?.maxPage !== undefined}
	<div class="pagination-container">
		<div class="pagination">
			<div>{'<'}</div>
			<div class="pagination-buttons-container">
				{#each Array($pagination.maxPage) as _, i}
					{#key i}
						<div class="pagination-button">
							{#if $pagination.page === i + 1 && inputPage}
								<div class="btn input-container default-inp">
									<input
										class="input-page"
										on:keydown={handleInputPageKeydown}
										on:blur={resetInputPage}
										bind:value={inputPageValue}
										autofocus
									/>
								</div>
							{/if}

							<Button
								class="pagination{$pagination.page === i + 1 ? ' active' : ''}"
								on:click={() => handlePaginationClick(i + 1)}
							>
								{i + 1}
							</Button>
						</div>
					{/key}
				{/each}
			</div>
			<div>{'>'}</div>
		</div>
	</div>
{/if}

<style>
	.pagination-container {
		bottom: 0;
		position: sticky;
		display: flex;
		justify-content: center;
		padding: 8px;
	}

	.pagination {
		display: flex;
	}

	.pagination-buttons-container {
		display: grid;
		grid-auto-columns: 1fr;
	}

	.pagination-button {
		grid-row: 1;
		position: relative;
	}

	.input-page {
		max-width: 100%;
		box-sizing: border-box;
		font-size: 14px;
		max-height: 100%;
		height: 100%;
		padding: 0px 8px;
	}

	.input-container {
		max-width: 50px;
		transform: translateX(-50%);
		left: 55%;
		box-sizing: border-box;
		position: absolute;
		display: flex;
		max-height: 100%;
		height: 100%;
		scale: 105%;
		z-index: 1;
	}
</style>
