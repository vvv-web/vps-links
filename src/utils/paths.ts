function ensureLeadingSlash(path: string): string {
	return path.startsWith('/') ? path : `/${path}`;
}

export function normalizeRoute(path: string): string {
	if (!path) {
		return '/';
	}

	const route = ensureLeadingSlash(path);

	if (route === '/' || route.startsWith('/#')) {
		return route;
	}

	return route.endsWith('/') ? route : `${route}/`;
}

export function normalizeBasePath(basePath: string): string {
	const route = ensureLeadingSlash(basePath || '/');
	return route.endsWith('/') ? route : `${route}/`;
}

export function joinBasePath(basePath: string, path: string): string {
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path;
	}

	const base = normalizeBasePath(basePath);

	if (!path || path === '/') {
		return base;
	}

	if (path.startsWith('/#')) {
		return `${base}${path.slice(1)}`;
	}

	const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
	return `${base}${normalizedPath}`;
}

export function isSectionActive(currentPath: string, sectionHref: string): boolean {
	const current = normalizeRoute(currentPath);

	if (sectionHref === '/#projects') {
		return current.startsWith('/projects/');
	}

	if (sectionHref === '/#knowledge') {
		return current.startsWith('/knowledge/');
	}

	return current === normalizeRoute(sectionHref);
}
