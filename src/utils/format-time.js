import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getDurationHours = (runtime) => Math.floor(runtime/60);

export const getDurationMinutes = (runtime) => {
  const hours = Math.floor(runtime/60);
  const minutes = runtime - hours*60;

  return minutes;
};
