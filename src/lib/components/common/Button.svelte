<script lang="ts">
	export let disabled: boolean = false;
</script>

<button class="btn {$$props.class}" on:click {disabled}>
	<slot />
</button>

<style>
	.btn {
		background-color: var(--default-btn-bg-color);
		transition-duration: 0.2s;
		border: 0;
		border-radius: 8px;
		cursor: pointer;
	}

	.btn:hover {
		background-color: var(--default-btn-bg-color-hover);
	}

	.btn-login {
		padding: 8px 12px;
		font-size: 16px;
		box-shadow: 0px 0px 10px 1px rgba(255, 255, 255, 0.5);
	}
</style>
