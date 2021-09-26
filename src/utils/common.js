import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {RECENTLY_IN_DAYS} from './const.js';

export const convertDate = (date) => {
  dayjs.extend(relativeTime);

  let originalDate = dayjs(date).format('YYYY/M/D H:mm');
  const recentlyDate = dayjs().subtract(RECENTLY_IN_DAYS, 'day');

  if (!dayjs(originalDate).isBefore(recentlyDate)) {
    originalDate = dayjs(originalDate).fromNow();
    return originalDate;
  }

  return originalDate;
};


export const addLeadZero = (value) => value < 10 ? `0${value}` : String(value);
