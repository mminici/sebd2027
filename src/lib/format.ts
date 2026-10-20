import type { Venue } from "../data";

export function ordinal(value: number): string {
	const mod100 = value % 100;
	const mod10 = value % 10;
	const suffix =
		mod100 >= 11 && mod100 <= 13 ? "th" : mod10 === 1 ? "st" : mod10 === 2 ? "nd" : mod10 === 3 ? "rd" : "th";
	return `${value}${suffix}`;
}

export function conferenceName(edition: number, series: string): string {
	return `${ordinal(edition)} ${series}`;
}

export function brandLabel(shortName: string, startDate: string): string {
	return `${shortName} ${startDate.slice(0, 4)}`;
}

export function formatPlace(address: Venue["address"]): string {
	return `${address.city} (${address.province}, ${address.region}), ${address.country}`;
}

export function directionsUrl(name: string, address: Venue["address"]): string {
	const query = `${name}, ${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
	return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

export function formatDay(iso: string): string {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(parseIso(iso));
}

export function formatRange(startIso: string, endIso: string): string {
	const start = parseIso(startIso);
	const end = parseIso(endIso);
	const day = new Intl.DateTimeFormat("en-GB", { day: "numeric" });
	const month = new Intl.DateTimeFormat("en-GB", { month: "long" });
	const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

	if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
		return `${day.format(start)}–${day.format(end)} ${monthYear.format(end)}`;
	}
	if (start.getFullYear() === end.getFullYear()) {
		return `${day.format(start)} ${month.format(start)} – ${day.format(end)} ${monthYear.format(end)}`;
	}
	return `${formatDay(startIso)} – ${formatDay(endIso)}`;
}

/** Inclusive list of ISO days from start to end. */
export function eachDay(startIso: string, endIso: string): string[] {
	const days: string[] = [];
	const cursor = parseIso(startIso);
	const end = parseIso(endIso).getTime();
	while (cursor.getTime() <= end) {
		const month = String(cursor.getMonth() + 1).padStart(2, "0");
		const day = String(cursor.getDate()).padStart(2, "0");
		days.push(`${cursor.getFullYear()}-${month}-${day}`);
		cursor.setDate(cursor.getDate() + 1);
	}
	return days;
}

function parseIso(iso: string): Date {
	const [year, month, day] = iso.split("-").map(Number);
	return new Date(year, month - 1, day);
}
