import {createElement} from '../utils.js';

const createShowMoreBtn = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoretButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreBtn();
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
