import StatisticView from '../view/statistic.js';
import {getDurationHours, getDurationMinutes} from '../utils/format-time.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {StatsType, TimeAgoDate} from '../utils/const.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {pickUserRank} from '../utils/user-rank.js';

dayjs.extend(isBetween);

export default class StatisticPresenter {
  constructor(container, filmsModel) {
    this._container = container;

    this._filmsModel = filmsModel;

    this._statisticComponent = null;
    this._currentFilter = StatsType.ALL;

    this._handleFiltersChange = this._handleFiltersChange.bind(this);
  }

  _getFilmsDataByFilter(films, currentFilter) {
    const currentDate = new Date();
    const weekAgoDate = dayjs().subtract(TimeAgoDate.WEEK, 'day').toDate();
    const monthAgoDate = dayjs().subtract(TimeAgoDate.MONTH, 'month').toDate();
    const yearAgoDate = dayjs().subtract(TimeAgoDate.YEAR, 'year').toDate();
    let filmsWatched = [];

    switch (currentFilter) {
      case StatsType.ALL:
        filmsWatched = films
          .filter((film) => film.alreadyWatched);
        break;

      case StatsType.TODAY:
        filmsWatched = films
          .filter((film) => film.alreadyWatched && dayjs(film.watchingDate).isSame(currentDate, 'day'));
        break;

      case StatsType.WEEK:
        filmsWatched = films
          .filter((film) => film.alreadyWatched && dayjs(film.watchingDate).isBetween(weekAgoDate, currentDate));
        break;

      case StatsType.MONTH:
        filmsWatched = films
          .filter((film) => film.alreadyWatched && dayjs(film.watchingDate).isBetween(monthAgoDate, currentDate));
        break;

      case StatsType.YEAR:
        filmsWatched = films
          .filter((film) => film.alreadyWatched && dayjs(film.watchingDate).isBetween(yearAgoDate, currentDate));
        break;
    }

    const watchedFilmsCount = filmsWatched.length;
    const userRank = pickUserRank(films);

    const totalDuration = filmsWatched.map((film) => film.runtime).reduce((count, film) => count + film);

    const totalDurationHours = getDurationHours(totalDuration);
    const totalDurationMinutes = getDurationMinutes(totalDuration);

    const allFilmsGenres = filmsWatched.reduce((allGenres, film) => {
      allGenres.push(...film.genres);

      return allGenres;
    }, []);

    let genresList = new Map();

    allFilmsGenres.forEach((genre) => {
      if (genresList.has(genre)) {
        let genreCount = genresList.get(genre);

        genresList.set(genre, ++genreCount);
      } else {
        genresList.set(genre, 1);
      }
    });

    genresList = new Map([...genresList.entries()].sort((genreA, genreB) => genreB[1] - genreA[1]));
    const topGenre = genresList.size > 0 ? genresList.keys().next().value : '';

    return {
      watchedFilmsCount,
      userRank,
      totalDurationHours,
      totalDurationMinutes,
      genresList,
      topGenre,
      currentFilter,
    };
  }

  _handleFiltersChange(value) {
    this._currentFilter = value;

    this._statisticComponent.updateData(
      this._getFilmsDataByFilter(this._filmsModel.getFilms(), this._currentFilter),
    );
  }

  destroy() {
    remove(this._statisticComponent);
  }

  init() {
    const data = this._getFilmsDataByFilter(this._filmsModel.getFilms(), this._currentFilter);

    this._statisticComponent = new StatisticView(data);

    this._statisticComponent.setFilterItemsChangeHandler(this._handleFiltersChange);
    render(this._container, this._statisticComponent, RenderPosition.BEFOREEND);
  }
}
