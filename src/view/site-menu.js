import AbstractView from './abstract.js';

const createSiteMenuTemplate = () =>  `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional" data-filter="stats">Stats</a>
    </nav>
  `;

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    if(evt.target.getAttribute("data-filter") === "stats") {
      evt.preventDefault();
      this._callback.click(evt.target);
    }    
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement()
      .addEventListener('click', this._clickHandler);
  }
}
