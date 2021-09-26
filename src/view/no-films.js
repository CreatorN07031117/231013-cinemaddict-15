import AbstractView from './abstract.js';
import {FilterType} from '../utils/const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no watchlist movies now',
  [FilterType.HISTORY]: 'There are no already watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};


const createNoFilms = (filterType) => {
  const noFilmsTextValue = NoFilmsTextType[filterType];

  return `<h2 class="films-list__title">${noFilmsTextValue}</h2>`;
};

export default class NoFilms extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoFilms(this._data);
  }
}
