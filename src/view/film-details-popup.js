import dayjs from 'dayjs';
import SmartView from './smart.js';
import {getDurationHours, getDurationMinutes} from '../utils/format-time.js';


const createFilmsDetailsPopup = (film) => {
  const genresList = film.genres;
  const genreContent = genresList
    .map((item) => `<span class="film-details__genre">${item}</span>`)
    .join('');
  const hoursRuntime = getDurationHours(film.runtime);
  const minutesRuntime = getDurationMinutes(film.runtime);

  const releaseDate = dayjs(film.realese).format('D MMMM YYYY');
  let watchlistMark = '<button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>';
  if (film.watchlist) {
    watchlistMark = '<button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>';
  }

  let markAsWatched = '<button type="button" class="film-details__control-button film-details__control-button--watched" id="watched" name="watched">Already watched</button>';
  if (film.alreadyWatched) {
    markAsWatched = '<button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>';
  }

  let favoriteMark = '<button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>';
  if (film.favorite) {
    favoriteMark = '<button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>';
  }

  return `<div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src=${film.poster} alt="">

            <p class="film-details__age">${film.ageRating}+</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${film.title}</h3>
                <p class="film-details__title-original">Original: ${film.alternativeTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${film.totalRating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${film.writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${film.actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${hoursRuntime}h ${minutesRuntime}m</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${film.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${genreContent}
                </td>
              </tr>
            </table>
            <p class="film-details__film-description">
            ${film.description}
            </p>
          </div>
        </div>
        <section class="film-details__controls">
          ${watchlistMark}
          ${markAsWatched}
          ${favoriteMark}
        </section>
      </div>`;
};


export default class FilmDetail extends SmartView  {
  constructor(film) {
    super();

    this._data = film;
    this._watchlistClicklHandler = this._watchlistClicklHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._favoritesClickHandler = this._favoritesClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmsDetailsPopup(this._data);
  }

  restoreHandlers() {
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
  }

  _watchlistClicklHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick(this._data);
  }

  _alreadyWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.alreadyWatchedClick(this._data);
  }

  _favoritesClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoritesClick(this._data);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistClicklHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._alreadyWatchedClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoritesClickHandler);
  }
}
