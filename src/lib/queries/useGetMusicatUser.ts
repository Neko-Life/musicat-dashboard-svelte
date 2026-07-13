import { getMusicatUser } from '$lib/services/general';
import { getMusicatUserQueryId } from '$lib/config/queryIds';
import { useQuery } from './useQuery';

export default function useGetMusicatUser() {
	return useQuery(getMusicatUserQueryId, getMusicatUser);
}
