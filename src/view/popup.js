import {createElement} from '../utils.js';

const createPopup = () => `<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
  </div>
</form>
</section>`;


export default class Popup {
  constructor(filmDetails, comments) {
    this._element = null;
    this._filmDetails = filmDetails;
    this._comments = comments;
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

  getFilmDetails() {
    return this._filmDetails;
  }

  setFilmDetails(filmDetails) {
    this._filmDetails = filmDetails;
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = comments;
  }

  removeElement() {
    this._element = null;
    this._filmDetails = null;
    this._comments = null;
  }
}
