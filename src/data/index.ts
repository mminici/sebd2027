import { parse } from "yaml";
import { z } from "astro/zod";
import conferenceRaw from "./conference.yaml?raw";
import datesRaw from "./dates.yaml?raw";
import committeesRaw from "./committees.yaml?raw";
import keynotesRaw from "./keynotes.yaml?raw";
import sponsorsRaw from "./sponsors.yaml?raw";
import venueRaw from "./venue.yaml?raw";
import callRaw from "./call.yaml?raw";
import registrationRaw from "./registration.yaml?raw";
import accommodationRaw from "./accommodation.yaml?raw";

const isoDate = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
	.refine(isCalendarDate, "Not a calendar date");

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/, "Use a slug or an empty string for home");

const navLinkSchema = z.strictObject({
	label: z.string().min(1),
	href: slug,
});

const navGroupSchema = z.strictObject({
	label: z.string().min(1),
	items: z.array(navLinkSchema).min(2),
});

const navigationEntrySchema = z.union([navLinkSchema, navGroupSchema]);

const conferenceSchema = z
	.strictObject({
		series: z.string().min(1),
		shortName: z.string().min(1),
		edition: z.number().int().positive(),
		dates: z.strictObject({
			start: isoDate,
			end: isoDate,
		}),
		summary: z.string().min(1),
		navigation: z.array(navigationEntrySchema).min(1),
	})
	.refine((conference) => conference.dates.end >= conference.dates.start, {
		path: ["dates", "end"],
		message: "End date is before the start date",
	});

const memberSchema = z.strictObject({
	name: z.string().min(1),
	affiliation: z.string().min(1),
});

const datesSchema = z.array(
	z.strictObject({
		id: z.string().min(1),
		label: z.string().min(1),
		date: isoDate,
		detail: z.string().min(1),
	}),
);

const committeesSchema = z.array(
	z.strictObject({
		id: z.string().min(1),
		name: z.string().min(1),
		members: z.array(memberSchema).min(1),
	}),
);

const keynotesSchema = z.array(
	z.strictObject({
		id: z.string().min(1),
		title: z.string().min(1),
		speaker: z.string().min(1),
		affiliation: z.string().min(1),
		summary: z.string().min(1),
	}),
);

const sponsorsSchema = z.array(
	z.strictObject({
		id: z.string().min(1),
		label: z.string().min(1),
		members: z.array(
			z.strictObject({
				id: z.string().min(1),
				name: z.string().min(1),
			}),
		).min(1),
	}),
);

const venueSchema = z.strictObject({
	name: z.string().min(1),
	description: z.string().min(1),
	address: z.strictObject({
		street: z.string().min(1),
		postalCode: z.string().min(1),
		city: z.string().min(1),
		province: z.string().min(1),
		region: z.string().min(1),
		country: z.string().min(1),
	}),
	arrival: z.array(
		z.strictObject({
			id: z.string().min(1),
			label: z.string().min(1),
			text: z.string().min(1),
		}),
	).min(1),
});

const optionalUrl = z.union([z.literal(""), z.string().url()]);

const callSchema = z.strictObject({
	topics: z.array(z.string().min(1)).min(1),
	tracks: z
		.array(
			z.strictObject({
				id: z.string().min(1),
				name: z.string().min(1),
				text: z.string().min(1),
			}),
		)
		.min(1),
	submissionNote: z.string().min(1),
	submissionUrl: optionalUrl,
	proceedings: z.string().min(1),
});

const registrationSchema = z.strictObject({
	summary: z.string().min(1),
	categories: z
		.array(
			z.strictObject({
				id: z.string().min(1),
				name: z.string().min(1),
				fee: z.string().min(1),
			}),
		)
		.min(1),
	formUrl: optionalUrl,
});

const accommodationSchema = z.strictObject({
	summary: z.string().min(1),
	rates: z.array(
		z.strictObject({
			id: z.string().min(1),
			name: z.string().min(1),
			detail: z.string().min(1),
			url: optionalUrl.optional(),
		}),
	),
});

function isCalendarDate(value: string): boolean {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) return false;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(year, month - 1, day);
	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function load<T>(fileName: string, raw: string, schema: z.ZodType<T>): T {
	let data: unknown;
	try {
		data = parse(raw);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`${fileName} could not be parsed: ${message}`);
	}

	const result = schema.safeParse(data);
	if (!result.success) {
		const details = result.error.issues
			.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
			.join("\n");
		throw new Error(`${fileName} is invalid\n${details}`);
	}
	return result.data;
}

function unique(fileName: string, label: string, values: string[]) {
	const seen = new Set<string>();
	for (const value of values) {
		if (seen.has(value)) throw new Error(`${fileName} has a duplicate ${label} "${value}"`);
		seen.add(value);
	}
}

export const conference = load("conference.yaml", conferenceRaw, conferenceSchema);
export const dates = load("dates.yaml", datesRaw, datesSchema);
export const committees = load("committees.yaml", committeesRaw, committeesSchema);
export const keynotes = load("keynotes.yaml", keynotesRaw, keynotesSchema);
export const sponsors = load("sponsors.yaml", sponsorsRaw, sponsorsSchema);
export const venue = load("venue.yaml", venueRaw, venueSchema);
export const call = load("call.yaml", callRaw, callSchema);
export const registration = load("registration.yaml", registrationRaw, registrationSchema);
export const accommodation = load("accommodation.yaml", accommodationRaw, accommodationSchema);

unique("conference.yaml", "href", navigationLinks().map((item) => item.href));
unique("dates.yaml", "id", dates.map((item) => item.id));
unique("committees.yaml", "id", committees.map((item) => item.id));
unique("keynotes.yaml", "id", keynotes.map((item) => item.id));
unique("sponsors.yaml", "id", sponsors.map((group) => group.id));
unique("venue.yaml", "id", venue.arrival.map((item) => item.id));
unique("call.yaml", "topic", call.topics);
unique("call.yaml", "id", call.tracks.map((track) => track.id));
unique("registration.yaml", "id", registration.categories.map((category) => category.id));
unique("accommodation.yaml", "id", accommodation.rates.map((rate) => rate.id));

export type NavLink = z.infer<typeof navLinkSchema>;
export type NavGroup = z.infer<typeof navGroupSchema>;
export type NavEntry = z.infer<typeof navigationEntrySchema>;
export type Conference = z.infer<typeof conferenceSchema>;
export type Deadline = z.infer<typeof datesSchema>[number];
export type Committee = z.infer<typeof committeesSchema>[number];
export type Keynote = z.infer<typeof keynotesSchema>[number];
export type SponsorGroup = z.infer<typeof sponsorsSchema>[number];
export type Venue = z.infer<typeof venueSchema>;
export type Call = z.infer<typeof callSchema>;
export type Registration = z.infer<typeof registrationSchema>;
export type Accommodation = z.infer<typeof accommodationSchema>;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
	return "items" in entry;
}

export function navigationLinks(entries: readonly NavEntry[] = conference.navigation): NavLink[] {
	return entries.flatMap((entry) => (isNavGroup(entry) ? entry.items : [entry]));
}

export function navigationItem(href: string) {
	const item = navigationLinks().find((entry) => entry.href === href);
	if (!item) throw new Error(`conference.yaml has no navigation item for "${href}"`);
	return item;
}
