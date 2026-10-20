/** Prefix an internal path with Astro's base URL. Home is an empty string. */
export function sitePath(href: string): string {
	const base = import.meta.env.BASE_URL;
	const slug = href.replace(/^\/+|\/+$/g, "");
	return slug ? `${base}${slug}` : base;
}

export function isCurrentPath(pathname: string, href: string): boolean {
	return normalize(pathname) === normalize(sitePath(href));
}

function normalize(path: string): string {
	const prefixed = path.startsWith("/") ? path : `/${path}`;
	if (prefixed.length > 1 && prefixed.endsWith("/")) return prefixed.slice(0, -1);
	return prefixed;
}
