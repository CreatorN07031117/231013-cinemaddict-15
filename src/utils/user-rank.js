import {MaxFilmsUserRank} from './const.js';
import {filter} from './filters.js';


export const pickUserRank = (films) => {
  let alreadyWatchedFilms = films.filter((film) => film.alreadyWatched).length;

 if(alreadyWatchedFilms = MaxFilmsUserRank.NO_RATING) {
      return '';
  } else if(alreadyWatchedFilms <= MaxFilmsUserRank.NOVICE) {
      return 'novice';
  } else if(alreadyWatchedFilms <= MaxFilmsUserRank.FAN) {
    return 'fan';
  } else{
      return 'movie buff';
  }
}