import {MaxFilmsUserRank} from './const.js';


export const pickUserRank = (films) => {
  const alreadyWatchedFilms = films.filter((film) => film.alreadyWatched);

  if(alreadyWatchedFilms.length === MaxFilmsUserRank.NO_RATING) {
    return '';
  } else if(alreadyWatchedFilms.length <= MaxFilmsUserRank.NOVICE) {
    return 'novice';
  } else if(alreadyWatchedFilms.length <= MaxFilmsUserRank.FAN) {
    return 'fan';
  } else{
    return 'movie buff';
  }
};
