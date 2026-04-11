/**
 * Calendar utilities.
 *
 * Builds an .ics (iCalendar) file as a data URL on the fly, so the "Add to
 * Calendar" button on the /reserve quiz success state and on /events/[slug]
 * works without a server round-trip. The resulting data URL opens directly
 * in Apple Calendar, Google Calendar (via download + import), and Outlook.
 *
 * Implementation detail: iCalendar wants timestamps in UTC basic form
 * (YYYYMMDDTHHMMSSZ). We take an ISO 8601 string from /lib/events (Miami
 * local with offset) and convert to UTC.
 */

import { SITE, VENUE } from "@/lib/constants";

type IcsEvent = {
  title: string;
  description: string;
  /** ISO 8601 start — /lib/events UpcomingEvent.startDate */
  start: string;
  /** ISO 8601 end */
  end: string;
  /** Stable unique id (event slug works fine) */
  uid: string;
  url?: string;
};

/** Format a Date into iCalendar UTC basic form: 20260412T020000Z */
function toIcsDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Escape iCalendar text per RFC 5545 §3.3.11 */
function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/** Build a full .ics body as a string. */
export function buildIcs(event: IcsEvent): string {
  const dtStart = toIcsDate(new Date(event.start));
  const dtEnd = toIcsDate(new Date(event.end));
  const dtStamp = toIcsDate(new Date());
  const location = `${VENUE.street}, ${VENUE.city}, ${VENUE.region} ${VENUE.postalCode}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE.name}//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}@${new URL(SITE.url).hostname}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(event.description)}`,
    `LOCATION:${esc(location)}`,
    ...(event.url ? [`URL:${event.url}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Build a data-URL href the <a> tag can download directly. */
export function buildIcsDataUrl(event: IcsEvent): string {
  const body = buildIcs(event);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}
