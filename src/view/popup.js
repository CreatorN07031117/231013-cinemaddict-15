import AbstractView from './abstract.js';

const createPopup = () => `<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
  </div>
</form>
</section>`;

export default class Popup extends AbstractView {
  constructor(filmDetails, comments) {
    super();

    this._filmDetails = filmDetails;
    this._comments = comments;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createPopup();
  }

  updateFilmDetails(film) {
    this._filmDetails.updateData(film);
  }

  updateComments(comments) {
    const update = {
      comments: comments,
      disabled: false,
    };

    this._comments.updateData(update);
  }

  removeElement() {
    this._element = null;
    this._filmDetails = null;
    this._comments = null;
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClosePopupClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickHandler);
  }
}
