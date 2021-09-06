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
  constructor (headerBlock, mainBlock, footerBlock) {
    this._headerBlock = headerBlock;
    this._mainBlock = mainBlock;
    this._footerBlock = footerBlock;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

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
    this._filmsIdList = new Map ();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._hidePopup = this._hidePopup.bind(this);
    this.__handleFilmPropertyChange = this._handleFilmPropertyChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init (films, commentsList) {
    this._films = films.slice();
    this._sourcedBoardFilms= films.slice();
    this._commentsList = commentsList.slice();

    render(this._headerBlock, this._userRankView, RenderPosition.BEFOREEND);

    this._renderSiteMenu (films);

    if(this._films.length > 0) {
      this._renderFilmsBoard(this._films);
    } else {
      render(this._mainBlock, this._emptyListMessage, RenderPosition.BEFOREEND);
    }
  }

  _renderSiteMenu (films) {
    this._siteMenu = new SiteMenuView(films);

    render(this._mainBlock, this._siteMenu, RenderPosition.BEFOREEND);
  }

  //Сокрытие попапа
  _hidePopup() {
    bodyElement.classList.remove('hide-overflow');
    this._popupComponent.getElement().remove();
    this._popupComponent.removeElement();
    this._popupComponent = null;
  }

  //Показ попапа
  _showPopup(film, filmDetails, comments) {
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this._hidePopup();
      }
    };

    if (this._popupComponent === null) {
      this._popupComponent = new PopupView(filmDetails, comments);
      render(this._footerBlock,  this._popupComponent, RenderPosition.AFTEREND);
      this._popupComponent.setClosePopupClickHandler(this._hidePopup);
      bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscKeyDown);
    } else {
      this._popupComponent.getFilmDetails().getElement().remove();
      this._popupComponent.getComments().getElement().remove();
      this._popupComponent.setFilmDetails(filmDetails);
      this._popupComponent.setComments(comments);
      console.log('double')
    }

    const filmDetailsContainer = this._popupComponent.getElement().querySelector('.film-details__top-container');
    render(filmDetailsContainer, filmDetails.getElement(), RenderPosition.BEFOREEND);
    render(filmDetailsContainer, comments.getElement(), RenderPosition.BEFOREEND);
  }

  //Рендеринг карточки фильма
  _renderFilmCard (filmsListElement, film, commentList, renderPosition) {
    this._filmCardComponent = new FilmCardView(film);
    const filmDetailsPopupComponent = new FilmDetailsPopupView(film);
    const commentsPopupComponet = new PopupCommentsView(commentList, film);

    this._filmCardComponent.setOpenCardClickHandler(() => {
      this._showPopup(this._filmCardComponent, filmDetailsPopupComponent, commentsPopupComponet);
    });

    render(filmsListElement, this._filmCardComponent, renderPosition);

    this._filmCardComponent.setWatchlistClickHandler (() => {
      this._handleWhatchlistClick(film);
    });

    this._filmCardComponent.setAlreadyWatchedClickHandler (() => {
      this._handleAlreadyWatchedClick(film);
    });

    this._filmCardComponent.setFavoritesClickHandler (() => {
      this._handleFavoritesClick(film);
    });

  }

  //Клик по кнопке Add to whatchlist
  _handleWhatchlistClick (film) {
    const updatefilm = Object.assign(
      {}, film , {watchlist: !film.watchlist},
    );
    this._handleFilmPropertyChange (updatefilm);
  }

  //клик по кнопке Mark as watched
  _handleAlreadyWatchedClick (film) {
    const updatefilm = Object.assign(
      {}, film , {alreadyWatched: !film.alreadyWatched},
    );
    this._handleFilmPropertyChange (updatefilm);
  }

  //Клик по кнопке Add to Favorite
  _handleFavoritesClick (film) {
    const updatefilm = Object.assign(
      {}, film , {favorite: !film.favorite},
    );
    this._handleFilmPropertyChange (updatefilm);
  }

  // Метод изменения свойства в фильме
  _handleFilmPropertyChange (updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    const prevFilmCard = this._filmsIdList.get(updatedFilm.id);
    this._renderFilmCard(prevFilmCard, updatedFilm, this._commentsList, RenderPosition.AFTEREND);
    remove(prevFilmCard);
    this._filmsIdList.set(updatedFilm.id, this._filmCardComponent);
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
  _renderFilmList (films, commentsList) {
    this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP));

    if (films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton (films, commentsList);
    }
  }

  //Очистка списка фильмов
  _clearFilmList () {
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
  _renderShowMoreButton () {
    render(this._sectionFilmsComponent.getElement().querySelector('.films-list'), this._showMoreBtnComponent, RenderPosition.BEFOREEND);

    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
  }

  _renderSort () {
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

    switch (sortType) {
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

  _renderFilmsBoard (films, commentsList) {
    this._renderSort();

    render(this._mainBlock, this._sectionFilmsComponent, RenderPosition.BEFOREEND);
    this._renderFilmList (films, commentsList);

    //блоки topRated и mostCommented
    render(this._sectionFilmsComponent, this._topRatedComponent, RenderPosition.BEFOREEND);
    const topRatedList = films.slice().sort((a, b) => b.totalRating - a.totalRating);
    for (let i = 0; i < ITEMS_IN_EXTRA_LIST; i++) {
      this._renderFilmCard(this._topRatedComponent.getElement().querySelector('.films-list__container'), topRatedList[i], commentsList, RenderPosition.BEFOREEND);
    }

    render(this._sectionFilmsComponent, this._mostCommentedComponent, RenderPosition.BEFOREEND);
    const mostCommentedList = films.sort((a, b) => b.comments.length - a.comments.length);

    for (let i = 0; i < ITEMS_IN_EXTRA_LIST; i++) {
      this._renderFilmCard(this._mostCommentedComponent.getElement().querySelector('.films-list__container'), mostCommentedList[i], commentsList, RenderPosition.BEFOREEND);
    }
  }
}
