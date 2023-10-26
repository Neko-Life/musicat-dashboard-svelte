<script>
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar />

<div class="page-container">
	<div class="avatar-container">
		<img
			src="https://cdn.discordapp.com/avatars/960168583969767424/97a14ce9e4106bc2a441c7d4ed438912.png?size=480"
			alt="Bot Avatar"
		/>
	</div>

	<h1>Musicat</h1>

	<p>Discord Music Bot written in C++</p>
</div>

<style>
	.page-container,
	.avatar-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.page-container {
		flex-grow: 1;
	}

	.avatar-container {
		border-radius: 999px;
		overflow: hidden;
	}
</style>
