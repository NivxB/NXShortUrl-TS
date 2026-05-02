export interface UrlEntry {
	originalUrl: string;
	createdAt: Date;
	hits: number;
}

const store = new Map<string, UrlEntry>();

export function saveUrl(slug: string, originalUrl: string): UrlEntry {
	const entry: UrlEntry = { originalUrl, createdAt: new Date(), hits: 0 };
	store.set(slug, entry);
	return entry;
}

export function getUrl(slug: string): UrlEntry | undefined {
	return store.get(slug);
}

export function incrementHits(slug: string): void {
	const entry = store.get(slug);
	if (entry) entry.hits += 1;
}

export function listUrls(): Array<{ slug: string } & UrlEntry> {
	return Array.from(store.entries()).map(([slug, entry]) => ({
		slug,
		...entry,
	}));
}
