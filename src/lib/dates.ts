export type DeadlineStatus = "past" | "soon" | "upcoming";

const DAY = 24 * 60 * 60 * 1000;

/** Past, due within 14 days, or later. Compared as calendar dates, not timestamps. */
export function deadlineStatus(iso: string, today = new Date()): DeadlineStatus {
	const [year, month, day] = iso.split("-").map(Number);
	const target = new Date(year, month - 1, day);
	const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	const diff = Math.round((target.getTime() - start.getTime()) / DAY);
	if (diff < 0) return "past";
	if (diff <= 14) return "soon";
	return "upcoming";
}
