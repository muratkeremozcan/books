enum Weekday {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

// namespace Weekday { // namespace is optional, but makes things a bit more clear
  export function isBusinessDay(day: Weekday) {
    switch (day) {
      case Weekday.Saturday:
      case Weekday.Sunday:
        return false
      default:
        return true;
    }
  }
// }

const mon = Weekday.Monday;
const sun = Weekday.Sunday;

// would have to use Weekday. notation if we used namespace
isBusinessDay(mon); //?
isBusinessDay(sun); //?
