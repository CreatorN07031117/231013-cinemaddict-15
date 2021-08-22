import {createElement} from '../utils.js';

const createEmptyListMessage = () => {
  `<section class="films-list">
  <h2 class="films-list__title">There are no movies in our database</h2>
  </section>`;
};

export default class EmptyListMessage {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyListMessage();
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
