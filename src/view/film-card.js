import dayjs from 'dayjs';
import AbstractView from './abstract.js';

const createFilmCardTemplate = (film) => {
  const releaseYear = dayjs(film.realese).format('YYYY');

  let watchlistMark = '<button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>';
  if (film.watchlist) {
    watchlistMark = '<button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>';
  }

  let markAsWatched = '<button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>';
  if (film.alreadyWatched) {
    markAsWatched = '<button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>';
  }

  let favoriteMark = '<button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>';
  if (film.favorite) {
    favoriteMark = '<button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>';
  }


  return `<article class="film-card">
    <h3 class="film-card__title">${film.title}</h3>
    <p class="film-card__rating">${film.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${film.runtime}</span>
      <span class="film-card__genre">${film.genres[0]}</span>
    </p>
    <img src=${film.poster} alt="" class="film-card__poster">
    <p class="film-card__description">${film.description.substr(0, 140)}</p>
      <a class="film-card__comments">${film.comments.length} comments</a>
    <div class="film-card__controls">
      ${watchlistMark}
      ${markAsWatched}
      ${favoriteMark}
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();

    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._watchlistClicklHandler = this._watchlistClicklHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._favoritesClickHandler = this._favoritesClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setOpenCardClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickHandler);
  }

  _watchlistClicklHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _alreadyWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  _favoritesClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoritesClick();
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClicklHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._alreadyWatchedClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoritesClickHandler);
  }
}
