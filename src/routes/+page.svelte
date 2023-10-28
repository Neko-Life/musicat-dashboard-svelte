<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { useQuery } from '@sveltestack/svelte-query';
	import { getBotPreview } from '$lib/services/general';
	import type { IBotPreview } from '$lib/interfaces/services/general';
	import type { IBaseAPIResponse } from '$lib/interfaces/services';

	let states: {
		avatarSrc: string;
		username: string;
		description: string;
	} = {
		avatarSrc: '',
		username: '',
		description: ''
	};

	const setBotPreviewStates = ({ avatar_url = '', username = '', description = '' } = {}) => {
		states.avatarSrc = avatar_url;
		states.username = username;
		states.description = description;
		states = { ...states };
	};

	const processBotPreview = (query: Response) => {
		if (!query) return;

		if (!query.ok) {
			setBotPreviewStates();
			return;
		}

		query.json().then((r: IBaseAPIResponse<IBotPreview>) => {
			setBotPreviewStates(r.data);
		});
	};

	const botPreviewQueryId = 'get-bot-preview';
	const botPreview = useQuery(botPreviewQueryId, getBotPreview, {
		onSuccess(data) {
			processBotPreview(data);
		}
	});
	$botPreview;
</script>

<Navbar />

<div class="page-container">
	<div class="avatar-container {states.avatarSrc.length ? 'active' : ''}">
		<img loading="lazy" src={states.avatarSrc} alt="" width="100%" />
	</div>

	<div class="desc-container">
		<h1>{states.username}</h1>

		<p>{states.description}</p>
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
		border-radius: 999px;
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
