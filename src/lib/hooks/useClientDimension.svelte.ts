// returns [W, H]
export default function useClientDimension(): [number, number] {
	// [W, H]
	let dimension: [number, number] = $state([0, 0]);

	return dimension;
}
