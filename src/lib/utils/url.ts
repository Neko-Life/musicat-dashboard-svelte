export function matchPath(path: string, pathname: string): boolean {
	return [path, path + '/'].includes(pathname);
}
