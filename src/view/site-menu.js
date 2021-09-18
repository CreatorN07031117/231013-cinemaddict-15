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

    evt.preventDefault();
    this._handler.click(evt.target);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setClickHandler(handler) {
    this._handler.click = handler;

    this.getElement()
      .addEventListener('click', this._clickHandler);
  }
}
