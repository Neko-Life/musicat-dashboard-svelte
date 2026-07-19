<script lang="ts">
	let { href, ...props }: { href?: string; [k: string]: any } = $props();
</script>

<a {href} class="btn {props.class || ''}" on:click>
	<slot />
</a>

<style>
	.btn {
		color: var(--default-bg-body);
	}

	.btn-login {
		padding: 8px 12px;
		box-shadow: 0px 0px 10px 1px rgba(255, 255, 255, 0.5);
		text-decoration: none;
	}

	@media (min-width: 480px) {
		.btn-login {
			font-size: 16px;
		}
	}

	@keyframes scale-in {
		0% {
			scale: 90%;
		}

		100% {
			scale: 100%;
		}
	}

	.btn.pagination {
		width: 100%;
		height: 100%;
		border-radius: 0px;
		font-size: 16px;
	}

	.btn.pagination.active,
	.btn.pagination:hover {
		font-weight: bold;
		background-color: var(--default-btn-bg-color-hover);
	}
</style>
