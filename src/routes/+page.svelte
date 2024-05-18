<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import useGetMusicatUser from '$lib/hooks/useGetMusicatUser';

	const musicatUser = useGetMusicatUser();
</script>

<Navbar />

<div class="page-container">
	<div class="avatar-container {$musicatUser.data?.data.avatar_url.length ? 'active' : ''}">
		<img loading="lazy" src={$musicatUser.data?.data.avatar_url} alt="" width="100%" />
	</div>

	<div class="desc-container">
		<h1>{$musicatUser.data?.data.username || ''}</h1>

		<p>{$musicatUser.data?.data.description || ''}</p>
	</div>
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
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.avatar-container.active {
		border-radius: 100%;
		overflow: hidden;
		box-shadow: 0px 0px 200px 10px rgba(255, 255, 255, 0.4);
		width: 256px;
		height: 256px;
	}

	.avatar-container img {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.desc-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
		justify-content: center;
		align-items: center;
		min-height: 74px;
	}
</style>
