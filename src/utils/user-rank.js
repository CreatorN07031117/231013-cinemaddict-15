import {MaxFilmsUserRank} from './const.js';


export const pickUserRank = (films) => {
  const alreadyWatchedFilms = films.filter((film) => film.alreadyWatched.length);

  if(alreadyWatchedFilms === MaxFilmsUserRank.NO_RATING) {
    return '';
  } else if(alreadyWatchedFilms <= MaxFilmsUserRank.NOVICE) {
    return 'novice';
  } else if(alreadyWatchedFilms <= MaxFilmsUserRank.FAN) {
    return 'fan';
  } else{
    return 'movie buff';
  }
};
