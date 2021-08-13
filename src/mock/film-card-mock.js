import {getRandomInteger} from '../utils.js';
import dayjs from 'dayjs';

const MIN_IN_LIST = 1;
const MAX_IN_LIST = 3;
const ROUNDING = 1;
const MAX_RATING = 10;
const MIN_RATING = 1;
const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 5;
const MAX_COMMENTS = 7;

//Генерация comments
const genereteCommentsId = (allComments) => {
  const commentsNumber = getRandomInteger(0, MAX_COMMENTS);

  return new Array(commentsNumber).fill().map(() => getRandomInteger(0, allComments-1));
};

//Генерация title
const mockTitles = [
  'Made for Each Other',
  'Santa Claus Conquers the Martians',
  'The Great Flamarion',
  'The Man with the Golden Arm',
  'The Dance of Life',
  'Sagebrush Trail',
  'Popeye the Sailor Meets Sindbad the Sailor'];

const generateTitle = () => {
  const randomTitles = getRandomInteger(0, mockTitles.length - 1);

  return mockTitles[randomTitles];
};

//Генерация film-description
const mockDescriptions = [
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

const genereteDescriptionPhrase = () => {
  const randomPhrase = getRandomInteger(0, mockDescriptions.length - 1);

  return mockDescriptions[randomPhrase];
};

const generateDescription = () => {
  const length = getRandomInteger(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH);

  return new Array(length).fill().map(() => genereteDescriptionPhrase()).join(5);
};

//Генерация poster
const mockPosters = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg'];


const generatePoster = () => {
  const randomPoster = getRandomInteger(0,  mockPosters.length - 1);

  return mockPosters[randomPoster];
};

//Генерация genre
const mockGenres = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Mystery',
  'Film-Noir',
  'Adventure',
  'Action',
  'Thrille',
  'Crime'];

const generateGenre = () => {
  const randomGenre = getRandomInteger(0, mockPosters.length - 1);

  return mockGenres[randomGenre];
};

const makeGenresList = () => {
  const length = getRandomInteger(MIN_IN_LIST, MAX_IN_LIST);

  return  new Array(length).fill().map(() => generateGenre());
};

//Генерация Director, Writers, Actors
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

const generateName = () => {
  const randomName = getRandomInteger(0,  mockNames.length - 1);

  return mockNames[randomName];
};

const makeWritersList = () => {
  const genereteNumberOfMembers = getRandomInteger(MIN_IN_LIST, MAX_IN_LIST);

  return new Array(genereteNumberOfMembers).fill().map(() => generateName());
};

const makeActorsList = new Array(MAX_IN_LIST).fill().map(() => generateName());


//Генерация Runtime
const generateRuntime = () => {
  const randomMinutes = getRandomInteger(0, 59);

  return `1 h ${randomMinutes}m`;
};

//Генерация Country
const mockCountries = [
  'USA',
  'Australia',
  'Great Britain',
  'Canada',
  'Finland'];

const generateFilmCountry = () => {
  const randomCountries = getRandomInteger(0,  mockCountries.length - 1);

  return mockCountries[randomCountries];
};

//Генерация Raiting
const genarateRating = () => {
  const ROUND = Math.pow(10, ROUNDING);
  const raiting = Math.random() * (MAX_RATING - MIN_RATING) + MIN_RATING;

  return Math.trunc(raiting * ROUND) / ROUND;
};

//Генерация Release Date
const generateReleaseDate = () => {
  const maxDaysGap = 5000;
  const daysGap = getRandomInteger(-maxDaysGap, 0);

  return dayjs().add(daysGap, 'day').toDate();
};

//Генерация age
const mockAgeRating = [
  '18+',
  '16+',
  '10+',
  '0+'];

const generateAgeRating = () => {
  const randomAge = getRandomInteger(0, mockAgeRating.length - 1);

  return mockAgeRating[randomAge];
};

//Генерация controls
const generateUserDetail = Boolean(getRandomInteger(0, 1));


export const generateFilm = (allComments) => {
  const title = generateTitle();
  const commentsId = genereteCommentsId(allComments);

  return {
    comments: commentsId,
    title: title,
    alternativeTitle: title,
    totalRating: genarateRating(),
    poster: generatePoster(),
    director: generateName(),
    writers: makeWritersList(),
    actors: makeActorsList,
    realese: generateReleaseDate(),
    runtime: generateRuntime(),
    country: generateFilmCountry(),
    genres: makeGenresList(),
    description: generateDescription(),
    ageRating: generateAgeRating(),
    watchlist: generateUserDetail,
    alreadyWatched: generateUserDetail,
    favorite: generateUserDetail};
};
