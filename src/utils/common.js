import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export const convertDate = (date) => {
  dayjs.extend(relativeTime);

  let originalDate = dayjs(date).format('YYYY/M/D H:mm');
  const recentlyDate = dayjs().subtract(3, 'day');

  if (!dayjs(originalDate).isBefore(recentlyDate)) {
    originalDate = dayjs(originalDate).fromNow();
    return originalDate;
  }

  return originalDate;
};


export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const addLeadZero = (value) => value < 10 ? `0${value}` : String(value);
