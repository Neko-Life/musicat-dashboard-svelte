<script lang="ts">
	// export let src: string | undefined;
	export let active: boolean | undefined;
</script>

<button class="menu-container {active ? 'active' : ''}" on:click>
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
		padding: 0px;
	}

	.menu-container * {
		transition-duration: 0.5s;
	}

	.menu {
		width: 100%;
		cursor: pointer;
		position: relative;
		border: 10px solid transparent;
		border-color: transparent;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 8px 0px;
	}

	.menu-container:hover .menu,
	.menu-container.active .menu {
		border-left-color: white;
		border-right-color: white;
		box-shadow: inset 44px 0px 20px -25px white, inset -44px 0px 20px -25px white;
	}

	.glow {
		border-radius: 100%;
		height: 70%;
		width: 1px;
	}
	.glow.right {
		transform: translateX(-3px);
	}

	.glow.left {
		transform: translateX(3px);
	}

	.menu-container:hover .glow,
	.menu-container.active .glow {
		box-shadow: 0px 0px 16px 20px white;
		background-color: white;
	}
</style>
