import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        title: film.film_info.title,
        alternativeTitle: film.film_info.alternative_title,
        totalRating: film.film_info.total_rating,
        poster: film.film_info.poster,
        director: film.film_info.director,
        writers: film.film_info.writers,
        actors: film.film_info.actors,
        realese: film.film_info.release.date,
        runtime: film.film_info.runtime,
        country: film.film_info.release.release_country,
        genres: film.film_info.genre,
        description: film.film_info.description,
        ageRating: film.film_info.age_rating,
        watchlist: film.user_details.watchlist,
        alreadyWatched: film.user_details.already_watched,
        watchingDate: film.user_details.watching_date,
        favorite: film.user_details.favorite,
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }


  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info.title': film.title,
        'film_info.alternative_title': film.alternativeTitle,
        'film_info.total_rating': film.totalRating,
        'film_info.poster': film.poster,
        'film_info.director': film.director,
        'film_info.writers': film.writers,
        'film_info.actors': film.actors,
        'film_info.release.date': film.realese,
        'film_info.runtime': film.runtime,
        'film_info.release.release_country': film.country,
        'film_info.genre': film.genres,
        'film_info.description': film.description,
        'film_info.age_rating': film.ageRating,
        'user_details.watchlist': film.watchlist,
        'user_details.already_watched': film.alreadyWatched,
        'user_details.watching_date': film.watchingDate,
        'user_details.favorite': film.favorite,
      },
    );

    delete adaptedFilm.title;
    delete adaptedFilm.alternativeTitle;
    delete adaptedFilm.totalRating;
    delete adaptedFilm.poster;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.realese;
    delete adaptedFilm.runtime;
    delete adaptedFilm.country;
    delete adaptedFilm.genres;
    delete adaptedFilm.description;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.watchlist;
    delete adaptedFilm.alreadyWatched;
    delete adaptedFilm.watchingDate;

    return adaptedFilm;
  }
}
