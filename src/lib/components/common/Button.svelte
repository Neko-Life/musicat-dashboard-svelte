<script lang="ts">
	export let disabled: boolean = false;
</script>

<button class="btn {$$props.class || ''}" on:click {disabled}>
	<slot />
</button>

<style>
	.btn {
		background-color: var(--default-btn-bg-color);
		transition-duration: 0.2s;
		border: 0;
		border-radius: 8px;
		cursor: pointer;
		animation: scale-in 1s ease-out;
	}

	.btn:hover {
		scale: 105%;
		background-color: var(--default-btn-bg-color-hover);
	}

	.btn:active {
		scale: 95%;
		background-color: var(--default-btn-bg-color-hover);
	}

	.btn-login {
		padding: 8px 12px;
		box-shadow: 0px 0px 10px 1px rgba(255, 255, 255, 0.5);
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
</style>
