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
import {SortType, UserAction, UpdateType} from '../utils/const.js';
import dayjs from 'dayjs';


const FILM_COUNT_PER_STEP = 5;
const ITEMS_IN_EXTRA_LIST = 2;
const bodyElement = document.querySelector('body');

export default class Board {
  constructor(headerBlock, mainBlock, footerBlock, filmsModel, commentsModel) {
    this._headerBlock = headerBlock;
    this._mainBlock = mainBlock;
    this._footerBlock = footerBlock;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._userRankView = new UserRankView();
    this._siteSortComponent = null;
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

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this)

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent)
  }

  init() {

    render(this._headerBlock, this._userRankView, RenderPosition.BEFOREEND);

    this._renderSiteMenu();

    if(this._getFilms().length > 0) {
      this._renderFilmsBoard();
    } else {
      render(this._mainBlock, this._emptyListMessage, RenderPosition.BEFOREEND);
    }
  }

  _handleViewAction(actionType, updateType, update) {

    switch (actionType) {
      case UserAction.UPDATE_FILMCARD:
        this._tasksModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._tasksModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._tasksModel.deleteComments(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        this._handleFilmPropertyChange(data);
      case UpdateType.MINOR:
        this._handleFilmPropertyChange(data);
        break;
      case UpdateType.MAJOR:
        this. _clearFilmList();
        this._renderFilms();
        break;
    }
  }

  _getFilms() {

    switch(this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().sort((filmA, filmB) => dayjs(filmB.realese).diff(dayjs(filmA.realese)));
      case SortType.RATING:
        return this._filmsModel.getFilms().sort((filmA, filmB) => filmB.totalRating - filmA.totalRating);
    }

    return this._filmsModel.getFilms();
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  _renderSiteMenu() {
    this._siteMenu = new SiteMenuView(this._getFilms());

    render(this._mainBlock, this._siteMenu, RenderPosition.BEFOREEND);
  }

  //Сокрытие попапа
  _hidePopup() {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._film = null;
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

    this._film = film;
    this._popupCommentsComponent = comments;

    this._popupComponent = new PopupView(filmDetails, this._popupCommentsComponent);
    render(this._footerBlock,  this._popupComponent, RenderPosition.AFTEREND);
    this._popupComponent.setClosePopupClickHandler(this._hidePopup);
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDown);

    const filmDetailsContainer = this._popupComponent.getElement().querySelector('.film-details__top-container');
    render(filmDetailsContainer, filmDetails.getElement(), RenderPosition.BEFOREEND);
    render(filmDetailsContainer, this._popupCommentsComponent.getElement(), RenderPosition.BEFOREEND);

    filmDetails.setWatchlistClickHandler(this._handleWhatchlistClick);
    filmDetails.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    filmDetails.setFavoritesClickHandler(this._handleFavoritesClick);
    this._popupCommentsComponent.setCommentDeleteClickHandler(this._handleCommentDeleteClick);
    this._popupCommentsComponent.setFormSubmitHandler(this._handleCommentSubmit);
  }

  //Удаление комментария
  _handleCommentDeleteClick(update) {

    const updateComments = update.comments;
    const commentsId =  updateComments.map((comment) => comment.id);

    const updateFilm = Object.assign(
      {}, this._film , {comments: commentsId},
    );
    //const indexNumber = this._commentsList.findIndex((comment) => comment.id === commentsId);
    //this._commentsList.splice(indexNumber, 1)

  }

  //Добавление комментария
  _handleCommentSubmit(update) {
    const updateComments = update.comments;
    const commentsId = updateComments.map((comment) => comment.id);
    const updateFilm = Object.assign(
      {}, this._film, {comments: commentsId},
    );

    const newComment = update.comments[commentsId.length-1];
    
    //this._commentsList.push(newComment);
    this._handleViewAction(UserAction.ADD_COMMENT, UpdateType.MINOR, newComment)
    this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.MINOR, newComment)
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

  //Клик по кнопке Mark as watched
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

  //Метод изменения свойства в фильме
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
  _renderFilms(films) {
    this._filmListContainer = this._sectionFilmsComponent.getElement().querySelector('.films-list__container');

    films.forEach((film) => {
      this._renderFilmCard(this._filmListContainer, film, this._getComments(), RenderPosition.BEFOREEND);
      this._filmsIdList.set(film.id, this._filmCardComponent);
    });
  }

  //Создание списка фильмов
  _renderFilmList() {
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, FILM_COUNT_PER_STEP));

    this._renderFilms(films)

    if (this._getFilms().length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
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
    const filmsCount = this._getFilms().length;

    const newRenderFilmCount = Math.min(filmsCount, this._renderedFilmsCount +  FILM_COUNT_PER_STEP)
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderFilmCount)

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderFilmCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreBtnComponent);
    }
  }

  //Рендеринг кнопки show more
  _renderShowMoreButton() {
    render(this._sectionFilmsComponent.getElement().querySelector('.films-list'), this._showMoreBtnComponent, RenderPosition.BEFOREEND);

    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
  }

  //Сортировка
  _renderSort() {
    if (this._siteSortComponent !== null) {
      this._siteSortComponent = null;
    }

    this._siteSortComponent = new SortBlockView();

    render(this._mainBlock, this._siteSortComponent, RenderPosition.BEFOREEND);
    this._siteSortComponent.setSortTypeClickHandler(this._handleSortTypeChange);
  }

  //Клик по сортировке
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmList();
    this._renderFilmList();
  }

  //Блоки Toprated и MostCommented
  _renderTopRated() {
    const films = this._getFilms();

    render(this._sectionFilmsComponent, this._topRatedComponent, RenderPosition.BEFOREEND);
    const topRatedList = films.slice().sort((a, b) => b.totalRating - a.totalRating);

    topRatedList
      .slice(0, ITEMS_IN_EXTRA_LIST)
      .forEach((film) => {
        this._renderFilmCard(this._topRatedComponent.getElement().querySelector('.films-list__container'), film, this._getComments(), RenderPosition.BEFOREEND);
        this._topRatedFilmsId.set(film.id, this._filmCardComponent);
      });
  }

  _renderMostCommented() {
    const films = this._getFilms();

    render(this._sectionFilmsComponent, this._mostCommentedComponent, RenderPosition.BEFOREEND);
    const mostCommentedList = films.sort((a, b) => b.comments.length - a.comments.length);

    mostCommentedList
      .slice(0, ITEMS_IN_EXTRA_LIST)
      .forEach((film) => {
        this._renderFilmCard(this._mostCommentedComponent.getElement().querySelector('.films-list__container'), film, this._getComments(), RenderPosition.BEFOREEND);
        this._mostCommentedFilmsId.set(film.id, this._filmCardComponent);
      });
  }

  //Рендеринг доски фильмов
  _renderFilmsBoard() {
    this._renderSort();

    render(this._mainBlock, this._sectionFilmsComponent, RenderPosition.BEFOREEND);
    this._renderFilmList();

    //блоки topRated и mostCommented
    this._renderTopRated();
    this._renderMostCommented();
  }
}
