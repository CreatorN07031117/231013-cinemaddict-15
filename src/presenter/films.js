import UserRankView from '../view/user-rank.js';
import SiteMenuView from '../view/site-menu.js';
import SortBlockView from '../view/site-sort.js';
import FilmListView from '../view/film-list.js';
import FilmCardView from '../view/film-card.js';
import ShowMoretBtnView from '../view/show-more-button.js';
import TopRatedBlockView from '../view/top-rated-block.js';
import MostCommentedBlockView from '../view/most-commented-block.js';
import FilmDetailsPopupView from '../view/film-details-popup.js';
import PopupCommentsView from '../view/popup-comments.js';
import PopupView from '../view/popup.js';
import EmptyListMessageView from '../view/list-empty.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../utils/const.js';
import dayjs from 'dayjs';


const FILM_COUNT_PER_STEP = 5;
const ITEMS_IN_EXTRA_LIST = 2;
const bodyElement = document.querySelector('body');

export default class Board {
  constructor(headerBlock, mainBlock, footerBlock, changeData) {
    this._headerBlock = headerBlock;
    this._mainBlock = mainBlock;
    this._footerBlock = footerBlock;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._changeData = changeData;

    this._userRankView = new UserRankView();
    this._siteSortComponent = new SortBlockView();
    this._sectionFilmsComponent = new FilmListView();
    this._topRatedComponent = new TopRatedBlockView();
    this._mostCommentedComponent = new MostCommentedBlockView();
    this._emptyListMessage = new EmptyListMessageView();
    this._showMoreBtnComponent = new ShowMoretBtnView();

    this._popupComponent = null;
    this._filmDetailsPopupComponent = null;
    this._commentPopupComponent = null;
    this._filmsIdList = new Map();
    this._topRatedFilmsId = new Map();
    this._mostCommentedFilmsId = new Map();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._hidePopup = this._hidePopup.bind(this);
    this._handleFilmPropertyChange = this._handleFilmPropertyChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleWhatchlistClick = this._handleWhatchlistClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
  }

  init(films, commentsList) {
    this._films = films.slice();
    this._sourcedBoardFilms = films.slice();
    this._commentsList = commentsList.slice();

    render(this._headerBlock, this._userRankView, RenderPosition.BEFOREEND);

    this._renderSiteMenu(films);

    if(this._films.length > 0) {
      this._renderFilmsBoard(this._films);
    } else {
      render(this._mainBlock, this._emptyListMessage, RenderPosition.BEFOREEND);
    }
  }

  _renderSiteMenu(films) {
    this._siteMenu = new SiteMenuView(films);

    render(this._mainBlock, this._siteMenu, RenderPosition.BEFOREEND);
  }

  //Сокрытие попапа
  _hidePopup() {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._openedFilmId = null;
    this._popupComponent.getElement().remove();
    this._popupComponent.removeElement();
    this._popupComponent = null;
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._hidePopup();
    }
  }

  //Показ попапа
  _showPopup(film, filmDetails, comments) {
    if (this._popupComponent !== null) {
      this._hidePopup();
    }

    this._popupComponent = new PopupView(filmDetails, comments);
    render(this._footerBlock,  this._popupComponent, RenderPosition.AFTEREND);
    this._popupComponent.setClosePopupClickHandler(this._hidePopup);
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDown);

    const filmDetailsContainer = this._popupComponent.getElement().querySelector('.film-details__top-container');
    render(filmDetailsContainer, filmDetails.getElement(), RenderPosition.BEFOREEND);
    render(filmDetailsContainer, comments.getElement(), RenderPosition.BEFOREEND);

    filmDetails.setWatchlistClickHandler(this._handleWhatchlistClick);
    filmDetails.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    filmDetails.setFavoritesClickHandler(this._handleFavoritesClick);
    comments.setCommentDeleteClickHandler(this._handleCommentDeleteClick);
    comments.setFormSubmitHandler(this._handleCommentSubmit);
  }

  _handleCommentDeleteClick (film) {

    const updateFilm = Object.assign(
      {}, film , {comments: this._changeData},
    );

    // this._handleFilmPropertyChange(updateFilm);
    this._popupComponent.updateFilmDetails(updateFilm);
  }

  _handleCommentSubmit (film) {
    const updateFilm = Object.assign(
      {}, film , {comments: this._changeData},
    );
    this._popupComponent.updateFilmDetails(updateFilm);
  }


  //Рендеринг карточки фильма
  _renderFilmCard(filmsListElement, film, commentList, renderPosition) {
    this._filmCardComponent = new FilmCardView(film);
    const filmDetailsPopupComponent = new FilmDetailsPopupView(film);
    const commentsPopupComponet = new PopupCommentsView(commentList, film);

    this._filmCardComponent.setOpenCardClickHandler(() => {
      this._openedFilmId = film.id;
      this._showPopup(film, filmDetailsPopupComponent, commentsPopupComponet);
    });

    render(filmsListElement, this._filmCardComponent, renderPosition);

    this._filmCardComponent.setWatchlistClickHandler(() => {
      this._handleWhatchlistClick(film);
    });

    this._filmCardComponent.setAlreadyWatchedClickHandler(() => {
      this._handleAlreadyWatchedClick(film);
    });

    this._filmCardComponent.setFavoritesClickHandler(() => {
      this._handleFavoritesClick(film);

    });
  }

  //Клик по кнопке Add to whatchlist
  _handleWhatchlistClick(film) {
    const updatefilm = Object.assign(
      {}, film , {watchlist: !film.watchlist},
    );
    this._handleFilmPropertyChange(updatefilm);
  }

  //клик по кнопке Mark as watched
  _handleAlreadyWatchedClick(film) {
    const updatefilm = Object.assign(
      {}, film , {alreadyWatched: !film.alreadyWatched},
    );
    this._handleFilmPropertyChange(updatefilm);
  }

  //Клик по кнопке Add to Favorite
  _handleFavoritesClick(film) {
    const updatefilm = Object.assign(
      {}, film , {favorite: !film.favorite},
    );
    this._handleFilmPropertyChange(updatefilm);
  }

  // Метод изменения свойства в фильме
  _handleFilmPropertyChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    const prevFilmCard = this._filmsIdList.get(updatedFilm.id);
    this._renderFilmCard(prevFilmCard, updatedFilm, this._commentsList, RenderPosition.AFTEREND);
    remove(prevFilmCard);
    this._filmsIdList.set(updatedFilm.id, this._filmCardComponent);

    if (this._openedFilmId === updatedFilm.id) {
      this._popupComponent.updateFilmDetails(updatedFilm);
    }

    if (this._topRatedFilmsId.has(updatedFilm.id)) {
      const prewTopRatedFilmCard = this._topRatedFilmsId.get(updatedFilm.id);
      this._renderFilmCard(prewTopRatedFilmCard, updatedFilm, this._commentsList, RenderPosition.AFTEREND);
      remove(prewTopRatedFilmCard);
      this._topRatedFilmsId.set(updatedFilm.id, this._filmCardComponent);
    }

    if (this._mostCommentedFilmsId.has(updatedFilm.id)) {
      const prewMostCommentedFilmCard = this._mostCommentedFilmsId.get(updatedFilm.id);
      this._renderFilmCard(prewMostCommentedFilmCard, updatedFilm, this._commentsList, RenderPosition.AFTEREND);
      remove(prewMostCommentedFilmCard);
      this._mostCommentedFilmsId.set(updatedFilm.id, this._filmCardComponent);
    }
  }

  //Список фильмов от-до
  _renderFilms(from, to) {
    this._filmListContainer = this._sectionFilmsComponent.getElement().querySelector('.films-list__container');

    this._films
      .slice(from, to)
      .forEach((film) => {
        this._renderFilmCard(this._filmListContainer, film, this._commentsList, RenderPosition.BEFOREEND);
        this._filmsIdList.set(film.id, this._filmCardComponent);
      });
  }

  //Создание списка фильмов
  _renderFilmList(films, commentsList) {
    this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP));

    if (films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton(films, commentsList);
    }
  }

  //Очистка списка фильмов
  _clearFilmList() {
    this._filmsIdList.forEach((filmCard) => remove(filmCard));
    this._filmsIdList.clear();
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreBtnComponent);
  }

  //Клик по кнопке show more
  _handleShowMoreBtnClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP);
    this._renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreBtnComponent);
    }
  }

  //Рендеринг кнопки show more
  _renderShowMoreButton() {
    render(this._sectionFilmsComponent.getElement().querySelector('.films-list'), this._showMoreBtnComponent, RenderPosition.BEFOREEND);

    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
  }

  _renderSort() {
    render(this._mainBlock, this._siteSortComponent, RenderPosition.BEFOREEND);
    this._siteSortComponent.setSortTypeClickHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmList(this._films, this._commentsList);
  }

  _sortFilms(sortType) {

    switch(sortType) {
      case SortType.DATE:
        this._films.sort((filmA, filmB) => dayjs(filmB.realese).diff(dayjs(filmA.realese)));
        break;
      case SortType.RATING:
        this._films.sort((a, b) => b.totalRating - a.totalRating);
        break;
      default:
        this._films = this._sourcedBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _renderTopRated(films) {
    render(this._sectionFilmsComponent, this._topRatedComponent, RenderPosition.BEFOREEND);
    const topRatedList = films.slice().sort((a, b) => b.totalRating - a.totalRating);

    topRatedList
      .slice(0, ITEMS_IN_EXTRA_LIST)
      .forEach((film) => {
        this._renderFilmCard(this._topRatedComponent.getElement().querySelector('.films-list__container'), film, this._commentsList, RenderPosition.BEFOREEND);
        this._topRatedFilmsId.set(film.id, this._filmCardComponent);
      });
  }

  _renderMostCommented(films) {
    render(this._sectionFilmsComponent, this._mostCommentedComponent, RenderPosition.BEFOREEND);
    const mostCommentedList = films.sort((a, b) => b.comments.length - a.comments.length);

    mostCommentedList
      .slice(0, ITEMS_IN_EXTRA_LIST)
      .forEach((film) => {
        this._renderFilmCard(this._mostCommentedComponent.getElement().querySelector('.films-list__container'), film, this._commentsList, RenderPosition.BEFOREEND);
        this._mostCommentedFilmsId.set(film.id, this._filmCardComponent);
      });
  }

  _renderFilmsBoard(films, commentsList) {
    this._renderSort();

    render(this._mainBlock, this._sectionFilmsComponent, RenderPosition.BEFOREEND);
    this._renderFilmList(films, commentsList);

    //блоки topRated и mostCommented
    this._renderTopRated(films);
    this._renderMostCommented(films);
  }
}
