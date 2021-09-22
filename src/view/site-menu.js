import AbstractView from './abstract.js';

const createSiteMenuTemplate = () =>  `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional" data-filter="stats">Stats</a>
    </nav>
  `;

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._clickStatsHandler = this._clickStatsHandler.bind(this);
    this._clickFiltersHandler = this._clickFiltersHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _clickStatsHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    if(evt.target.getAttribute('data-filter') === 'stats') {
      evt.preventDefault();

      this.getElement().querySelector('.main-navigation__item').classList.remove('main-navigation__item--active');
      evt.target.classList.add('main-navigation__item--active');
      this.getElement().removeEventListener('click', this._clickStatsHandler);
      this._callback.clickStats(evt.target);
    }
  }

  _clickFiltersHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    if(evt.target.getAttribute('data-filter') !== 'stats') {
      evt.preventDefault();
      this.getElement().querySelector('.main-navigation__additional').classList.remove('main-navigation__item--active');
      evt.target.classList.add('main-navigation__item--active');
      this.getElement().removeEventListener('click', this._clickFiltersHandler);
      this._callback.clickFilter(evt.target);
    }
  }

  setClickStatsHandler(callback) {
    this._callback.clickStats = callback;

    this.getElement()
      .addEventListener('click', this._clickStatsHandler);
  }

  setClickFilters(callback) {
    this._callback.clickFilter = callback;

    this.getElement()
      .addEventListener('click', this._clickFiltersHandler);
  }

}
