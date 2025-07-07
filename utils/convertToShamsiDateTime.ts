import moment from 'moment-jalaali';

/**
 * Converts a datetime string to Shamsi date/time format.
 * @param datetime A string like '2025-05-24 14:25:42.347000'
 * @param options Options to return date, time, or both.
 * @returns The formatted string based on options.
 */
export function convertToShamsiDateTime(
  datetime: string,
  options: { date?: boolean; time?: boolean } = { date: true, time: true }
): string {
  if (!datetime) return '';

  const m = moment(datetime, 'YYYY-MM-DD HH:mm:ss.SSSSSS').locale('fa');

  const datePart = m.format('jYYYY/jMM/jDD');
  const timePart = m.format('HH:mm');

  if (options.date && options.time) return `${datePart} - ${timePart}`;
  if (options.date) return datePart;
  if (options.time) return timePart;

  return '';
}
