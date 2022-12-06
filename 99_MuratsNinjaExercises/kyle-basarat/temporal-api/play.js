// https://blog.webdevsimplified.com/2022-02/temporal-date-api/

import { Temporal, Intl, toTemporalInstant } from "@js-temporal/polyfill";
Date.prototype.toTemporalInstant = toTemporalInstant;

new Date().toTemporalInstant(); //?

const now = Temporal.Now;

// plain vs zoned : when dealing with time zones or daylight savings, use zoned

// easiest
now.plainDateTimeISO().toString(); //?

// no timezone or daylight savings concern
now.plainDateISO().toString(); //?

// no timezone or date concerns
now.plainTimeISO().toString(); //?

// if you're working with a different calendar system than ISO 8601
now.plainDateTime("persian").toString(); //?

// contains timezone and daylight savings
now.zonedDateTimeISO().toString(); //?
now.zonedDateTime("persian").toString(); //?
now.timeZone().toString(); //?

// Temporal.
// Duration
// Instant
// Now
// PlainDate
// PlainDateTime
// PlainMonthDay
// PlainTime
// PlainYearMonth
// Timezone
// ZonedDateTime

// creating a new date vs using now
const plainDate = new Temporal.PlainDate(2022, 1, 1);
plainDate.toString(); //?

// a better way to create a new date is to use from method
const plainDateFrom = Temporal.PlainDateTime.from({
  year: 2022,
  month: 1,
  day: 1,
});
plainDateFrom.toString(); //?

const zonedDateFrom = Temporal.ZonedDateTime.from({
  year: 2022,
  month: 1,
  day: 1,
  timeZone: Temporal.Now.timeZone(), // "UTC"
});
zonedDateFrom.toString(); //?

// Instant is for using UTC
const instant = Temporal.Now.instant();
instant.toString(); //?

const instant2 = Temporal.Instant.from("2022-01-02-06:00");
instant2.toString(); //?

///// HELPER METHODS

// adding or subtracting duration: add subtract
const now2 = Temporal.Now.plainDateISO();
now2.add({ days: 1, months: 3, years: 1 }).toString(); //?
now2.subtract({ days: 1, months: 3, years: 1 }).toString(); //?
const now3 = Temporal.Now.plainDateTimeISO()
  .add({ days: 1, months: 3, years: 1 })
  .subtract({ days: 1, months: 3, years: 1 });

// comparing dates: since until equals with
now2 === now3; //?
now2.equals(now3); //?
now2.since(now3.add({ days: 1, months: 1 })).toString(); //?
now2.until(now3.add({ days: 1, months: 1 })).toString(); //?
// with takes in an object, and overwrites the current object with that
now2.with({ year: 2021 }); //?

// round is used to round a date to a specific unit
const now4 = Temporal.Now.plainDateTimeISO(); //?
now4.round("hour"); //?
now4.round({ smallestUnit: "hour", roundingMode: "floor" }); //?
now4.round({ smallestUnit: "hour", roundingMode: "ceil" }); //?
now4.round({
  smallestUnit: "hour",
  roundingIncrement: 4,
  roundingMode: "ceil",
}); //?

// compare is used to make sorting dates easier
const today = Temporal.Now.plainDateTimeISO();
const yesterday = today.subtract({ days: 1 });
const tomorrow = today.add({ days: 1 });
const days = [today, yesterday, tomorrow];
days.sort(Temporal.PlainDate.compare).map((d) => d.toString()); //?

// duration: to represent a duration of time
const duration = Temporal.Duration.from({ days: 3 });
duration.toString(); //?
now2.add(duration).toString(); //?
duration.negated().toString(); //?
duration.negated().abs().toString(); //?
duration.total("minutes"); //?
duration.total("hours"); //?
Temporal.Duration.from({ days: 3, months: 4 }).total({
  unit: "minutes",
  relativeTo: now2,
}); //?

const timeZone = Temporal.TimeZone.from("Africa/Cairo");
timeZone.toString(); //?
