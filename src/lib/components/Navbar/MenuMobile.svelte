<script lang="ts">
	let { active, href, ...props } = $props();
</script>

<a {href} class="menu-container {props.class || ''} {active ? 'active' : ''}" on:click>
	<!--
	<div class="glow left" />
        -->
	<div class="menu">
		<slot />
	</div>
	<!--
	<div class="glow right" />
        -->
</a>

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
		text-decoration: none;
	}

	.menu-container:active {
		box-shadow:
			inset 10px 0px 40px -10px var(--default-color-hint),
			inset -10px 0px 40px -10px var(--default-color-hint);
	}

	.menu {
		font-size: 28px;
	}
</style>
