import {createElement} from '../utils.js';

const createTopRatedBlock = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container">
    </div>
  </section>`
);

export default class TopRatedBlock {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTopRatedBlock();
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
