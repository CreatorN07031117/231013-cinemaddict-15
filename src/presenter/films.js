import UserRankView from '../view/user-rank.js';
import SortingView from '../view/sorting.js';
import FilmListView from '../view/film-list.js';
import FilmCardView from '../view/film-card.js';
import ShowMoretBtnView from '../view/show-more-button.js';
import TopRatedBlockView from '../view/top-rated-block.js';
import MostCommentedBlockView from '../view/most-commented-block.js';
import PopupCommentsView from '../view/popup-comments.js';
import PopupFilmDetailsView from '../view/popup-film-details.js';
import PopupView from '../view/popup.js';
import NoFilmsView from '../view/no-films.js';
import LoadingView from '../view/loading.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {FILM_COUNT_PER_STEP, ITEMS_IN_EXTRA_LIST, SortType, UserAction, UpdateType, State} from '../utils/const.js';
import {Filter} from '../utils/filters.js';
import dayjs from 'dayjs';


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

    this._sortingComponent = null;
    this._sectionFilmsComponent = new FilmListView();
    this._topRatedComponent = new TopRatedBlockView();
    this._mostCommentedComponent = new MostCommentedBlockView();
    this._noFilmsComponent = null;
    this._showMoreBtnComponent = new ShowMoretBtnView();
    this._loadingComponent = new LoadingView();

    this._popupComponent = null;
    this._filmsIdList = new Map();
    this._topRatedFilmsId = new Map();
    this._mostCommentedFilmsId = new Map();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._hidePopup = this._hidePopup.bind(this);
    this._handleFilmPropertyChange = this._handleFilmPropertyChange.bind(this);
    this._handlePopupPropertyChange = this._handlePopupPropertyChange.bind(this);
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
          this.setViewState(State.ADDING, '');
        }
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
            this._updateUserRank();
          })
          .catch(() => {
            if (this._popupCommentsComponent) {
              this.setViewState(State.ABORTING, '');
            }
          });
        break;
      case UserAction.ADD_COMMENT:
        this.setViewState(State.ADDING, '');
        this._api.addComment(update, this._film.id)
          .then((response) => {
            this._commentsModel.setComments(response.comments);
            this._filmsModel.updateFilm(updateType, response.movie);
          })
          .catch(() => this.setViewState(State.ABORTING, ''));
        break;
      case UserAction.DELETE_COMMENT:
        this.setViewState(State.DELETING, update.commentId);
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
          .catch(() => this.setViewState(State.ABORTING, ''));
        break;
    }
  }


  _handleModelEvent(updateType, update) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._handleFilmPropertyChange(update.id);
        this._updateUserRank();
        if(this._popupComponent !== null){
          this._handlePopupPropertyChange(update.id);
        }
        break;
      case UpdateType.MINOR:
        this._clearFilmList(false, false);
        this._renderFilmList(this._renderedFilmsCount);
        this._updateUserRank();
        if(this._popupComponent !== null){
          this._handlePopupPropertyChange(update.id);
        }
        break;
      case UpdateType.MAJOR:
        this._clearFilmList(true, true);
        this._renderFilmList(FILM_COUNT_PER_STEP);
        this._updateUserRank();
        if(this._popupComponent !== null){
          this._handlePopupPropertyChange(update.id);
        }
        break;
      case UpdateType.INIT:
        remove(this._loadingComponent);
        this.renderFilmsBoard();
        break;
    }
  }


  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = Filter[filterType](films);

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


  _renderNoFilms() {
    const filterType = this._filterModel.getFilter();
    this._noFilmsComponent = new NoFilmsView(filterType);

    render(this._sectionFilmsComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }


  setViewState(state, deletedCommentId) {
    const resetFormState = () => {
      this._popupCommentsComponent.updateData({
        disabled: false,
        deleting: false,
      });
    };

    switch (state) {
      case State.ADDING:
        this._popupCommentsComponent.updateData({
          newComment: '',
          emotion: null,
          disabled: true,
        });
        break;
      case State.DELETING:
        this._popupCommentsComponent.updateData(
          {
            disabled: true,
            deleting: true,
            deletedCommentId: deletedCommentId,
          });
        break;
      case State.ABORTING:
        this._popupCommentsComponent.shake(resetFormState);
        break;
    }
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
        const filmDetails = new PopupFilmDetailsView(film);
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
      UpdateType.PATCH,
      {
        id: this._film.id,
        commentId,
      });
  }


  _handleCommentSubmit(update) {
    const newComment = update;

    this._handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH, newComment);
  }


  _renderFilmCard(filmsListElement, film, renderPosition) {
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
      this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.PATCH, updatedFilm);
      return;
    }

    this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.MINOR, updatedFilm);
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
      this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.PATCH, updatedFilm);
      return;
    }

    this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.MINOR, updatedFilm);
  }


  _handleFavoritesClick(film) {
    const updatedFilm = Object.assign(
      {}, film , {favorite: !film.favorite},
    );
    const filterType = this._filterModel.getFilter();

    if(filterType === 'all') {
      this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.PATCH, updatedFilm);
      return;
    }

    this._handleViewAction(UserAction.UPDATE_FILMCARD, UpdateType.MINOR, updatedFilm);
  }


  _handleFilmPropertyChange(filmId) {
    const updatedFilm = this._filmsModel.getFilm(filmId);

    if (this._topRatedFilmsId.has(filmId)) {
      const prewTopRatedFilmCard = this._topRatedFilmsId.get(filmId);

      this._renderFilmCard(prewTopRatedFilmCard, updatedFilm, RenderPosition.AFTEREND);
      remove(prewTopRatedFilmCard);
      this._topRatedFilmsId.set(filmId, this._filmCardComponent);
    }

    if (this._mostCommentedFilmsId.has(filmId)) {
      const prewMostCommentedFilmCard = this._mostCommentedFilmsId.get(filmId);
      this._renderFilmCard(prewMostCommentedFilmCard, updatedFilm, RenderPosition.AFTEREND);
      remove(prewMostCommentedFilmCard);
      this._mostCommentedFilmsId.set(filmId, this._filmCardComponent);
    }

    const prevFilmCard = this._filmsIdList.get(filmId);
    this._renderFilmCard(prevFilmCard, updatedFilm, RenderPosition.AFTEREND);
    remove(prevFilmCard);
    this._filmsIdList.set(filmId, this._filmCardComponent);
  }

  _handlePopupPropertyChange(filmId) {
    const updatedFilm = this._filmsModel.getFilm(filmId);
    const comments = this._commentsModel.getComments();

    this._popupComponent.updateFilmDetails(updatedFilm);
    this._popupComponent.updateComments(comments);
  }


  _renderFilms(films) {
    this._filmListContainer = this._sectionFilmsComponent.getElement().querySelector('.films-list__container');

    films.forEach((film) => {
      this._renderFilmCard(this._filmListContainer, film, RenderPosition.BEFOREEND);
      this._filmsIdList.set(film.id, this._filmCardComponent);
    });
  }


  _renderFilmList(renderedFilms) {
    const filmsCount = this._getFilms().length;

    this._renderSort();
    render(this._mainBlock, this._sectionFilmsComponent, RenderPosition.BEFOREEND);

    if(filmsCount === 0) {
      remove(this._sortingComponent);
      this._renderNoFilms();
      return;
    }

    if(this._noFilms !== null) {
      remove(this._noFilmsComponent);
    }

    const films = this._getFilms().slice(0, Math.min(filmsCount, renderedFilms));
    this._updateUserRank();
    this._renderFilms(films);

    if (this._getFilms().length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }


  _clearFilmList(resetRenderedFilmsCount = true, resetSortType = false) {
    this._filmsIdList.forEach((filmCard) => remove(filmCard));
    this._filmsIdList.clear();
    remove(this._sortingComponent);
    remove(this._showMoreBtnComponent);
    if(this._noFilms !== null) {
      remove(this._noFilmsComponent);
    }

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILM_COUNT_PER_STEP;
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
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);

    this._sortingComponent.setSortTypeClickHandler(this._handleSortTypeChange);
    render(this._mainBlock, this._sortingComponent, RenderPosition.BEFOREEND);
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmList();
    this._renderFilmList(FILM_COUNT_PER_STEP);
  }


  _renderTopRated() {
    const films = this._getFilms();

    render(this._sectionFilmsComponent, this._topRatedComponent, RenderPosition.BEFOREEND);
    const topRatedList = films.slice().sort((a, b) => b.totalRating - a.totalRating);

    topRatedList
      .slice(0, ITEMS_IN_EXTRA_LIST)
      .forEach((film) => {
        this._renderFilmCard(this._topRatedComponent.getElement().querySelector('.films-list__container'), film, RenderPosition.BEFOREEND);
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
        this._renderFilmCard(this._mostCommentedComponent.getElement().querySelector('.films-list__container'), film, RenderPosition.BEFOREEND);
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
    remove(this._sortingComponent);
    this._clearFilmList();
    remove(this._topRatedComponent);
    remove(this._mostCommentedComponent);
    remove(this._loadingComponent);
    remove(this._sectionFilmsComponent);
  }

  renderFilmsBoard() {
    const filmsCount = this._getFilms().length;

    if(this._noFilms !== null) {
      remove(this._noFilmsComponent);
    }

    this._renderFilmList(FILM_COUNT_PER_STEP);

    if(filmsCount !== 0) {
      this._renderTopRated();
      this._renderMostCommented();
    }
  }
}
