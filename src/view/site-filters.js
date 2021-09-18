import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  const filterCount = type !== 'all'
    ? `<span class="main-navigation__item-count">${count}</span>`
    : '';

  const activeFilterClassName = type === currentFilterType
    ? 'main-navigation__item--active'
    : '';

  return `<a href="#${type}" class="main-navigation__item ${activeFilterClassName}" data-filter="${type}">${name} ${filterCount}</a>`;
};

const createFilmsFilterTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>`;
};

export default class FilmsFilter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  getTemplate() {
    return createFilmsFilterTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;

    this.getElement()
      .addEventListener('click', this._filterTypeChangeHandler);
  }
}
