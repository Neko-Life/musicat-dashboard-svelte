<script lang="ts">
	import { pagination } from '$lib/store';
	import PaginationButton from './Pagination/PaginationButton.svelte';
	import ArrowLeftSolid from './icons/ArrowLeftSolid.svelte';

	const handlePrevPage = () => {
		if ($pagination) {
			if ($pagination.page > 1) {
				$pagination.page--;
			}
		}

		return 1 as const;
	};

	const handleNextPage = () => {
		if ($pagination) {
			if ($pagination.page < $pagination.maxPage) {
				$pagination.page++;
			}
		}

		return 1 as const;
	};
</script>

{#if $pagination?.maxPage !== undefined}
	<div class="pagination-container">
		<div class="pagination">
			<div class="pagination-buttons-container">
				<PaginationButton onPageClick={handlePrevPage} index={-1}>
					<div class="icon-container{$pagination.page <= 1 ? ' disabled' : ''}">
						<ArrowLeftSolid height={24} />
					</div>
				</PaginationButton>
				{#each Array($pagination.maxPage > 5 ? 5 : $pagination.maxPage) as _, i}
					{#key i}
						{#if $pagination.maxPage > 5 && i === 2}
							<PaginationButton index={-2} />
						{:else}
							<PaginationButton
								index={$pagination.maxPage > 5 && i > 2
									? $pagination.maxPage + i - 5
									: i}
							/>
						{/if}
					{/key}
				{/each}
				<PaginationButton onPageClick={handleNextPage} index={-1}>
					<div
						class="icon-container{$pagination.page >= $pagination.maxPage
							? ' disabled'
							: ''}"
					>
						<ArrowLeftSolid class="arr-rotate" height={24} />
					</div>
				</PaginationButton>
			</div>
		</div>
	</div>
{/if}

<style>
	.pagination-container {
		bottom: 8px;
		position: sticky;
		display: flex;
		justify-content: center;
		padding: 8px;
		z-index: 5;
		--svg-fill: var(--default-bg-body);
	}

	.icon-container {
		display: flex;
	}

	.disabled {
		--svg-fill: gray;
	}

	.pagination {
		background-color: var(--default-btn-bg-color-hover);
		display: flex;
	}

	.pagination-buttons-container {
		display: grid;
		grid-auto-columns: 1fr;
	}
</style>
