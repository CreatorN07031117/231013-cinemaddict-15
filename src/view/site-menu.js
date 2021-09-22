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

    if(evt.target.getAttribute("data-filter") === "stats") {
      evt.preventDefault();
      this.getElement().removeEventListener('click', this._clickStatsHandler);
      this._callback.click(evt.target);
    }    
  }

  _clickFiltersHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    if(!(evt.target.getAttribute("data-filter") === "stats")) {
      evt.preventDefault();
      this.getElement().removeEventListener('click', this._clickFiltersHandler);
      this._callback.click(evt.target);
    }   
  }

  setClickStatsHandler(callback) {
    this._callback.click = callback;

    this.getElement()
      .addEventListener('click', this._clickStatsHandler);
  }

  setClickFilters(callback) {
    this._callback.click = callback;

    this.getElement()
      .addEventListener('click', this._clickFiltersHandler);
  }

}
