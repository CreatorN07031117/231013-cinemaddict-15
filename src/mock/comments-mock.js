import {getRandomInteger} from '../utils.js';
import dayjs from 'dayjs';

const COMMENT_EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];


//Генерация comment-author
const mockNames = [
  'Anthony Mann',
  'Ridley Scott',
  'Christopher Nolan',
  'Sidney Lumet',
  'Peter Jackson',
  'Steven Spielberg',
  'Quentin Tarantino',
  'Sergio Leone',
  'David Fincher',
  'Anne Wigton',
  'Heinz Herald',
  'Brad Pitt',
  'Zach Grenier',
  'Edward Norton',
  'David Andrews',
  'Eugenie Bondurant',
  'Christina Cabot',
  'Charlie Dell',
  'Joel Bissonnette',
  'Lou Beatty Jr.',
  'Jared Leto',
  'Joon Kim',
  'Paul Carafotes',
  'Leonard Termo',
  'Jeffrey J. Ayers',
  'Eddie Hargitay',
  'Baron Jay',
  'Hugh Peddy'];

const generateCommentAuthor = () => {
  const randomName = getRandomInteger(0,  mockNames.length - 1);

  return mockNames[randomName];
};

//Генерация comment-text
const mockComments = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'];

const generateCommentText = () => {
  const randomText = getRandomInteger(0, mockComments.length - 1);

  return mockComments[randomText];
};

//Генерация comment-emoji
const generateEmotion = () => {
  const randomEmoji = getRandomInteger(0, COMMENT_EMOTIONS.length - 1);

  return COMMENT_EMOTIONS[randomEmoji];
};

//Генерация comment-day
const generateCommentDay = () => {
  const maxDaysGap = 30;
  const daysGap = getRandomInteger(-maxDaysGap, 0);

  return dayjs().add(daysGap, 'day').toDate();
};


export const generateComment = (reviewId) => {
  return {
    id: reviewId,
    author: generateCommentAuthor(),
    comment: generateCommentText(),
    date: generateCommentDay(),
    emotion: generateEmotion(),
  };
};
