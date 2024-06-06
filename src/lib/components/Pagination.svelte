<script lang="ts">
	import { pagination } from '$lib/store';
	import PaginationButton from './Pagination/PaginationButton.svelte';

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
			<PaginationButton onPageClick={handlePrevPage} index={-1}>{'<'}</PaginationButton>
			<div class="pagination-buttons-container">
				{#each Array($pagination.maxPage) as _, i}
					{#key i}
						<PaginationButton index={i} />
					{/key}
				{/each}
			</div>
			<PaginationButton onPageClick={handleNextPage} index={-1}>{'>'}</PaginationButton>
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
</style>
