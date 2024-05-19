<script lang="ts">
	import useGetMusicatUser from '$lib/queries/useGetMusicatUser';
	import type { IBotPreview } from '$lib/interfaces/services/general';

	let musicatUser: ReturnType<typeof useGetMusicatUser>;
	let mcUser: IBotPreview | undefined;
	$: {
		musicatUser = useGetMusicatUser();
		mcUser = $musicatUser?.data?.data;

		if (mcUser?.username) {
			document.title = `${mcUser.username} Dashboard`;
		}

		if (typeof document !== 'undefined' && mcUser?.avatar_url) {
			const el = document.getElementById('rel-icon') as HTMLLinkElement | null;
			if (el) {
				el.href = mcUser.avatar_url;
			}
		}
	}
</script>
