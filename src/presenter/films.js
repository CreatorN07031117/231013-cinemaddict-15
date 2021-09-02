import UserRankView from '../view/user-rank.js';
import SiteMenuView from '../view/site-menu.js';
import SortBlockView from '../view/site-sort.js';
import FilmListView from '../view/film-list.js';
import FilmCardView from '../view/film-card.js';
import ShowMoretBtnView from '../view/show-more-button.js';
import TopRatedBlockView from '../view/top-rated-block.js';
import MostCommentedBlockView from '../view/most-commented-block.js';
import FooterStaticticsView from '../view/site-footer-statistic.js';
import FilmDetailsPopupView from '../view/film-details-popup.js';
import PopupCommentsView from '../view/popup-comments.js';
import PopupView from '../view/popup.js';
import EmptyListMessageView from '../view/list-empty.js';
import {render, RenderPosition, remove} from '../utils/render.js';


const FILM_COUNT_PER_STEP = 5;
const ITEMS_IN_EXTRA_LIST = 2;
const bodyElement = document.querySelector('body');

export default class Board {
  constructor (headerBlock, mainBlock, footerBlock) {
    this._headerBlock = headerBlock;
    this._mainBlock = mainBlock;
    this._footerBlock = footerBlock;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    this._userRankView = new UserRankView();
    this._siteSortBlock = new SortBlockView();
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
  }

  init (films, commentsList) {
    this._films = films.slice();
    this._commentsList = commentsList.slice();

    render(this._headerBlock, this._userRankView, RenderPosition.BEFOREEND);
    
    this._renderSiteMenu (films);

    if(this._films.length > 0) {
        this._renderFilmsBoard(this._films);
      } else {
        render(this._filmsBlock, this._emptyListMessage, RenderPosition.BEFOREEND);
      }
  }

  _renderSiteMenu (films) {
    this._siteMenu = new SiteMenuView(films);
    
    render(this._mainBlock, this._siteMenu, RenderPosition.BEFOREEND);
  }

  _hidePopup() {
    bodyElement.classList.remove('hide-overflow');
    this._popupComponent.getElement().remove();
    this._popupComponent.removeElement();
    this._popupComponent = null;
  }

  _showPopup(filmDetails, comments) {
    const onEscKeyDown = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          this._hidePopup()
        }
      };

    if (this._popupComponent === null) {
        this._popupComponent = new PopupView(filmDetails, comments);
        render(this._footerBlock,  this._popupComponent, RenderPosition.AFTEREND);
        this._popupComponent.setClosePopupClickHandler(this._hidePopup);
        bodyElement.classList.add('hide-overflow');
        document.addEventListener('keydown', onEscKeyDown);
      }
      else {
        this._popupComponent.getFilmDetails().getElement().remove();
        this._popupComponent.getComments().getElement().remove();
        this._popupComponent.setFilmDetails(filmDetails);
        this._popupComponent.setComments(comments);
      }

      const filmDetailsContainer = this._popupComponent.getElement().querySelector('.film-details__top-container');
      render(filmDetailsContainer, filmDetails.getElement(), RenderPosition.BEFOREEND);
      render(filmDetailsContainer, comments.getElement(), RenderPosition.BEFOREEND);


  }

  _renderFilmCard (filmsListElement, film, commentList) {
    const filmCardComponent = new FilmCardView(film);
    const filmDetailsPopupComponent = new FilmDetailsPopupView(film);
    const commentsPopupComponet = new PopupCommentsView(commentList, film);
  
    filmCardComponent.setOpenCardClickHandler(() => {
      this._showPopup(filmDetailsPopupComponent, commentsPopupComponet);
    });
  
    render(filmsListElement, filmCardComponent, RenderPosition.BEFOREEND);

    this._filmsIdList.set(film.id, filmCardComponent);
  };

  _renderFilms(from, to) {
    const filmListContainer = this._sectionFilmsComponent.getElement().querySelector('.films-list__container')

    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(filmListContainer, film, this._commentsList))
  }

  _renderFilmList (films, commentsList) {
    this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP)); 

    if (films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton (films, commentsList) 
    }
  }

  _handleShowMoreBtnClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP);
    this._renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderShowMoreButton (films, commentsList) {
    render(this._sectionFilmsComponent.getElement().querySelector('.films-list'), this._showMoreBtnComponent, RenderPosition.BEFOREEND);
    
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick )
  }

  
  _renderFilmsBoard (films, commentsList) {
    render(this._mainBlock, this._siteSortBlock, RenderPosition.BEFOREEND);

    render(this._mainBlock, this._sectionFilmsComponent, RenderPosition.BEFOREEND);
    this._renderFilmList (films, commentsList);

    //блоки topRated и mostCommented
    render(this._sectionFilmsComponent, this._topRatedComponent, RenderPosition.AFTEREND);
    const topRatedList = films.slice().sort((a, b) => b.totalRating - a.totalRating);
    for (let i = 0; i < ITEMS_IN_EXTRA_LIST; i++) {
      this._renderFilmCard( this._topRatedComponent.getElement().querySelector('.films-list__container'), topRatedList[i], commentsList);
    }

    render(this._sectionFilmsComponent, this._mostCommentedComponent, RenderPosition.AFTEREND);
    const mostCommentedList = films.sort((a, b) => b.comments.length - a.comments.length);
  
    for (let i = 0; i < ITEMS_IN_EXTRA_LIST; i++) {
        this._renderFilmCard(this._mostCommentedComponent.getElement().querySelector('.films-list__container'), mostCommentedList[i], commentsList);
    }
  }
}
