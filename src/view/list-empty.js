import AbstractView from './abstract.js';
import {FilterType} from '../utils/const.js';

const EmptyListTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WHATCHLIST]: 'There are no whatchlist movies now',
  [FilterType.HISTORY]: 'There are no already watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};


const createEmptyListMessage = (filterType) => {
  const emptyListTextValue = EmptyListTextType[filterType];

  return `<section class="films-list">
  <h2 class="films-list__title">${emptyListTextValue}</h2>
  </section>`;
};

export default class EmptyListMessage extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    console.log(this._data)
    return createEmptyListMessage(this._data);
  }
}
