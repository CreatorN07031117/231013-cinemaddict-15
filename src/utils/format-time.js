import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import {MINUTES_IN_HOUR} from './const.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getDurationHours = (runtime) => Math.floor(runtime/MINUTES_IN_HOUR);

export const getDurationMinutes = (runtime) => {
  const hours = Math.floor(runtime/MINUTES_IN_HOUR);
  const minutes = runtime - hours*MINUTES_IN_HOUR;

  return minutes;
};
