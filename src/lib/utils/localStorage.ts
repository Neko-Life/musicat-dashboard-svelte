import type { ILocalStorageDatas, ILocalStorageDatasKeys } from '$lib/interfaces/localStorage';

export function setStorage<K extends ILocalStorageDatasKeys>(key: K, val: ILocalStorageDatas[K]) {
	const dataStr = JSON.stringify(val);

	localStorage.setItem(key, dataStr);
}

export function getStorage<K extends ILocalStorageDatasKeys>(
	key: K
): ILocalStorageDatas[K] | undefined {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return;

		const ret: ILocalStorageDatas[K] = JSON.parse(raw);

		return ret;
	} catch (e) {
		console.error('getStorage');
		console.error(e);

		// ignore any error and simply returns undefined
		return;
	}
}
