import {createElement} from '../utils.js';

const createPopup = () => '<section class="film-details"></section>';


export default class Popup {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPopup();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
