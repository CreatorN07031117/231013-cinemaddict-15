const countFilms = (films) => {
  let whatchlistCounter = 0;
  let favoriteCounter = 0;
  let historyCounter = 0;

  for (const film of films) {
    const watchlist = film.watchlist;
    const alreadyWatched = film.already_watched;
    const favorite = film.favorite;

    if (watchlist) {
      whatchlistCounter++;
    }

    if (alreadyWatched) {
      historyCounter++;
    }

    if (favorite) {
      favoriteCounter++;
    }
  }

  return [whatchlistCounter, historyCounter, favoriteCounter];
};


export const createSiteMenuTemplate = (films) => {
  const filmsCounter = countFilms(films);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filmsCounter[0]}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filmsCounter[1]}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filmsCounter[2]}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
