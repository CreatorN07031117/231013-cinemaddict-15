import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import RelativeTime from 'dayjs/plugin/RelativeTime';

dayjs.extend(duration);
dayjs.extend(RelativeTime);


export const getDurationHours = (runtime) => Math.floor(runtime/60);


export const getDurationMinutes = (runtime) => {
  const hours = Math.floor(runtime/60);
  const minutes = runtime - hours*60;

  return minutes;
};
