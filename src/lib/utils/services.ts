import { API_DOMAIN, SECURE_PROTOCOL } from '$lib/config';

export function getAPIUrl(path: string = '') {
	return `http${SECURE_PROTOCOL ? 's' : ''}://${API_DOMAIN}${path}`;
}

export function getWSUrl(path: string = '') {
	return `ws${SECURE_PROTOCOL ? 's' : ''}://${API_DOMAIN}${path}`;
}
