import dayjs from 'dayjs';


export const createFilmsDetailsPopup = (film) => {
  const genresList = film.genres;
  const genreContent = genresList
    .map((item) => `<span class="film-details__genre">${item}</span>`)
    .join();

  const releaseDate = dayjs(film.realese).format('D MMMM YYYY');
  let watchlistMark = '<button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>';
  if (film.watchlist) {
    watchlistMark = '<button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>';
  }

  let markAsWatched = '<button type="button" class="film-details__control-button film-details__control-button--watched" id="watched" name="watched">Already watched</button>';
  if (film.already_watched) {
    markAsWatched = '<button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>';
  }

  let favoriteMark = '<button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>';
  if (film.favorite) {
    favoriteMark = '<button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>';
  }

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src=${film.poster} alt="">
  
            <p class="film-details__age">${film.age_rating}</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${film.title}</h3>
                <p class="film-details__title-original">Original: ${film.alternative_title}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${film.total_rating}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${film.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${film.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${film.runtime}</td>
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
      </div>
  
    </form>
  </section>`;
};
