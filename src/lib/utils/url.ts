export function matchPath(path: string, pathname: string): boolean {
	return [path, path + '/'].includes(pathname);
}

export function createLoginRedirectParam(pathname: string) {
	return `redirect_uri=${encodeURIComponent(pathname)}`;
}
