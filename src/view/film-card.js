import dayjs from 'dayjs';

export const createFilmCardTemplate = (film) => {
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
