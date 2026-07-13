<script lang="ts">
	let { active, ...props } = $props();
</script>

<button class="menu-container {props.class || ''} {active ? 'active' : ''}" on:click>
	<!--
	<div class="glow left" />
        -->
	<div class="menu">
		<slot />
	</div>
	<!--
	<div class="glow right" />
        -->
</button>

<style>
	.menu-container {
		display: flex;
		flex: 1;
		align-items: center;
		background-color: transparent;
		outline: none;
		border: none;
		padding: 16px 24px;
		transition-duration: 0.2s;
	}

	.menu-container:active {
		box-shadow: inset 10px 0px 40px -10px blue, inset -10px 0px 40px -10px blue;
	}

	.menu {
		font-size: 28px;
	}
</style>
