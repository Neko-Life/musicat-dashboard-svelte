<script lang="ts">
	let { active, href, ...props }: { active?: boolean; href?: string; [k: string]: any } =
		$props();
</script>

<a {href} class="menu-container {props.class || ''} {active ? 'active' : ''}" on:click>
	<!--
	<div class="glow left" />
        -->
	<div class="menu">
		<div class="menu-border">
			<slot />
		</div>
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
		padding: 0px;
		max-width: 200px;
		text-decoration: none;
	}

	.menu-container * {
		transition-duration: 0.5s;
		transition-timing-function: ease-out;
	}

	.menu {
		width: 100%;
		cursor: pointer;
		position: relative;
		margin: 10px 0px 10px 0px;
		border-top: 0px solid transparent;
		border-bottom: 0px solid transparent;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-color: transparent;
	}

	.menu-container:hover:not(.active) .menu {
		border-left-color: white;
		border-right-color: white;
	}

	.menu-container.active .menu,
	.menu-container:active .menu {
		box-shadow:
			inset 44px 0px 20px -40px white,
			inset -44px 0px 20px -40px white;
	}

	.menu-container.active .menu {
		border-top: 10px solid white;
		border-bottom: 10px solid white;
		margin: 0px;
	}

	.menu-border {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 8px 0px;
		border-top: 1px solid;
		border-bottom: 1px solid;
		border-color: transparent;
	}

	.menu-container:hover .menu-border,
	.menu-container.active .menu-border {
		border-color: white;
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
