import UserRankView from '../view/user-rank.js';
import {filter} from '../utils/filters.js';
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
import LoadingView from '../view/loading.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {SortType, UserAction, UpdateType, State} from '../utils/const.js';
import dayjs from 'dayjs';


const FILM_COUNT_PER_STEP = 5;
const ITEMS_IN_EXTRA_LIST = 2;
const bodyElement = document.querySelector('body');

export default class Board {
  constructor(headerBlock, mainBlock, footerBlock, filmsModel, commentsModel, filterModel, api) {
    this._headerBlock = headerBlock;
    this._mainBlock = mainBlock;
    this._footerBlock = footerBlock;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._api = api;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._siteSortComponent = null;
    this._sectionFilmsComponent = new FilmListView();
    this._topRatedComponent = new TopRatedBlockView();
    this._mostCommentedComponent = new MostCommentedBlockView();
    this._emptyListMessageComponent = null;
    this._showMoreBtnComponent = new ShowMoretBtnView();
    this._loadingComponent = new LoadingView();

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
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderUserRank();
    this._renderLoading();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILMCARD:
        if (this._popupCommentsComponent) {
          this._popupCommentsComponent.setViewState(State.ADDING);
        }
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
            this._updateUserRank();
          })
          .catch(() => {
            if (this._popupCommentsComponent) {
              this._popupCommentsComponent.setViewState(State.ABORTING);
            }
          });
        break;
      case UserAction.ADD_COMMENT:
        this._popupCommentsComponent.setViewState(State.ADDING);
        this._api.addComment(update, this._film.id)
          .then((response) => {
            this._commentsModel.setComments(response.comments);
            this._filmsModel.updateFilm(updateType, response.movie);
          })
          .catch(() => this._popupCommentsComponent.setViewState(State.ABORTING));
        break;
      case UserAction.DELETE_COMMENT:
        this._popupCommentsComponent.setViewState(State.DELETING);
        this._api.deleteComment(update)
          .then(() => {
            this._commentsModel.deleteComments(updateType, update);
            this._filmsModel.updateFilm(
              updateType,
              Object.assign(
                {},
                this._filmsModel.getFilm(update.id),
                {
                  comments: this._commentsModel.getComments().map((item) => item.id),
                }));
          })
          .catch(() => this._popupCommentsComponent.setViewState(State.ABORTING));
        break;
    }
  }

  _handleModelEvent(updateType, update) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._handleFilmPropertyChange(update.id);
        this._updateUserRank();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({resetRenderedTaskCount: true, resetSortType: true});
        this._renderFilmList();
        this._updateUserRank();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsBoard();
        break;
    }
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch(this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort((filmA, filmB) => dayjs(filmB.realese).diff(dayjs(filmA.realese)));
      case SortType.RATING:
        return filtredFilms.sort((filmA, filmB) => filmB.totalRating - filmA.totalRating);
    }

    return filtredFilms;
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  _renderLoading() {
    render(this._mainBlock, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderEmptyListMessage() {
    const filterType = this._filterModel.getFilter();
    this._emptyListMessageComponent = new EmptyListMessageView(filterType);
    render(this._filmListContainer, this._emptyListMessageComponent, RenderPosition.AFTERBEGIN);
  }

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


  _showPopup(film) {
    if (this._popupComponent !== null) {
      this._hidePopup();
    }

    this._api.getComments(film.id)
      .then((commentList) => {
        this._commentsModel.setComments(commentList);
        this._film = film;
        const filmDetails = new FilmDetailsPopupView(film);
        this._popupCommentsComponent = new PopupCommentsView(commentList, film);

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
      });
  }


  _handleCommentDeleteClick(update) {
    const commentId = update;

    this._handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {
        id: this._film.id,
        commentId,
      });
  }


  _handleCommentSubmit(update) {
    /*const updatedComments = update.comments;
    const commentsId = updatedComments.map((comment) => comment.id);

    const newComment = update.comments[commentsId.length-1];*/
    const newComment = update;

    this._handleViewAction(UserAction.ADD_COMMENT, UpdateType.MINOR, newComment);
  }


  _renderFilmCard(filmsListElement, film, commentList, renderPosition) {
    this._filmCardComponent = new FilmCardView(film);

    this._filmCardComponent.setOpenCardClickHandler(() => {
      this._openedFilmId = film.id;
      this._showPopup(film);
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

  _handleWhatchlistClick(film) {
    const updatedFilm = Object.assign(
      {}, film , {watchlist: !film.watchlist},
    );
    const filterType = this._filterModel.getFilter();

    if(filterType === 'all') {
      this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.MINOR, updatedFilm);
      return
    }

    this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.MAJOR, updatedFilm);
  }


  _handleAlreadyWatchedClick(film) {
    const updatedFilm = Object.assign(
      {},
      film,
      {
        alreadyWatched: !film.alreadyWatched,
        watchingDate: dayjs(),
      },
    );
    const filterType = this._filterModel.getFilter();

    if(filterType === 'all') {
      this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.MINOR, updatedFilm);
      return
    }

    this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.MAJOR, updatedFilm);
  }


  _handleFavoritesClick(film) {
    const updatedFilm = Object.assign(
      {}, film , {favorite: !film.favorite},
    );
    const filterType = this._filterModel.getFilter();

    if(filterType === 'all') {
      this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.MINOR, updatedFilm);
      return
    }

    this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.MAJOR, updatedFilm);
  }


  _handleFilmPropertyChange(filmId) {
    const prevFilmCard = this._filmsIdList.get(filmId);
    const updatedFilm = this._filmsModel.getFilm(filmId);
    this._renderFilmCard(prevFilmCard, updatedFilm, this._getComments(), RenderPosition.AFTEREND);
    remove(prevFilmCard);
    this._filmsIdList.set(filmId, this._filmCardComponent);

    if (this._openedFilmId === filmId) {
      const comments = this._commentsModel.getComments();
      this._popupComponent.updateFilmDetails(updatedFilm);
      this._popupComponent.updateComments(comments);
      this._popupCommentsComponent.reset(comments, updatedFilm)
    }

    if (this._topRatedFilmsId.has(filmId)) {
      const prewTopRatedFilmCard = this._topRatedFilmsId.get(filmId);
      this._renderFilmCard(prewTopRatedFilmCard, updatedFilm, this._getComments(), RenderPosition.AFTEREND);
      remove(prewTopRatedFilmCard);
      this._topRatedFilmsId.set(filmId, this._filmCardComponent);
    }

    if (this._mostCommentedFilmsId.has(filmId)) {
      const prewMostCommentedFilmCard = this._mostCommentedFilmsId.get(filmId);
      this._renderFilmCard(prewMostCommentedFilmCard, updatedFilm, this._getComments(), RenderPosition.AFTEREND);
      remove(prewMostCommentedFilmCard);
      this._mostCommentedFilmsId.set(filmId, this._filmCardComponent);
    }
  }


  _renderFilms(films) {
    this._filmListContainer = this._sectionFilmsComponent.getElement().querySelector('.films-list__container');

    films.forEach((film) => {
      this._renderFilmCard(this._filmListContainer, film, this._getComments(), RenderPosition.BEFOREEND);
      this._filmsIdList.set(film.id, this._filmCardComponent);
    });
  }


  _renderFilmList() {
    const filmsCount = this._getFilms().length;

    this._renderSort();
    render(this._mainBlock, this._sectionFilmsComponent, RenderPosition.BEFOREEND);

    if(filmsCount === 0) {
      remove(this._siteSortComponent);
      this._renderEmptyListMessage();
      return
    } 

    if(this._emptyListMessage !== null) {
      remove(this._emptyListMessageComponent);
    }

    const films = this._getFilms().slice(0, Math.min(filmsCount, FILM_COUNT_PER_STEP));
    this._updateUserRank();
    this._renderFilms(films);

    if (this._getFilms().length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
    
  }


  _clearFilmList(resetRenderedFilmsCount = false, resetSortType = false) {
    this._filmsIdList.forEach((filmCard) => remove(filmCard));
    this._filmsIdList.clear();
    remove(this._siteSortComponent);
    remove(this._showMoreBtnComponent);

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(this._filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }


  _handleShowMoreBtnClick() {
    const filmsCount = this._getFilms().length;

    const newRenderFilmCount = Math.min(filmsCount, this._renderedFilmsCount +  FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderFilmCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderFilmCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreBtnComponent);
    }
  }


  _renderShowMoreButton() {
    render(this._sectionFilmsComponent.getElement().querySelector('.films-list'), this._showMoreBtnComponent, RenderPosition.BEFOREEND);

    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
  }


  _renderSort() {
    if (this._siteSortComponent !== null) {
      this._siteSortComponent = null;
    }

    this._siteSortComponent = new SortBlockView(this._currentSortType);

    this._siteSortComponent.setSortTypeClickHandler(this._handleSortTypeChange);
    render(this._mainBlock, this._siteSortComponent, RenderPosition.BEFOREEND);
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmList({resetRenderedTaskCount: true});
    this._renderFilmList();
  }


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

  _renderUserRank() {
    const films = this._filmsModel.getFilms();

    this._userRankView = new UserRankView(films);
    render(this._headerBlock, this._userRankView, RenderPosition.BEFOREEND);
  }

  _updateUserRank() {
    remove(this._userRankView);
    this._userRankView = null;

    this._renderUserRank();
  }

  destroy() {
    remove(this._siteSortComponent);
    this._clearFilmList();
    remove(this._topRatedComponent);
    remove(this._mostCommentedComponent);
    remove(this._loadingComponent);
    remove(this._sectionFilmsComponent);
  }

  _renderFilmsBoard() {
    const filmsCount = this._getFilms().length;

    if(filmsCount === 0) {
      this._renderEmptyListMessage();
      return
    } 

    if(this._emptyListMessage !== null) {
      remove(this._emptyListMessageComponent);
    }

    this._renderFilmList();


    this._renderTopRated();
    this._renderMostCommented();
  }
}
