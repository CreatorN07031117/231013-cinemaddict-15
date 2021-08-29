import UserRankView from './view/user-rank.js';
import SiteMenuView from './view/site-menu.js';
import SortBlockView from './view/site-sort.js';
import FilmListView from './view/film-list.js';
import FilmCardView from './view/film-card.js';
import ShowMoretBtnView from './view/show-more-button.js';
import TopRatedBlockView from './view/top-rated-block.js';
import MostCommentedBlockView from './view/most-commented-block.js';
import FooterStaticticsView from './view/site-footer-statistic.js';
import FilmDetailsPopupView from './view/film-details-popup.js';
import PopupCommentsView from './view/popup-comments.js';
import PopupView from './view/popup.js';
import EmptyListMessageView from './view/list-empty.js';
import {generateFilm} from './mock/film-card-mock.js';
import {generateComment} from './mock/comments-mock.js';
import {render, RenderPosition, remove} from './utils/render.js';


const ITEMS_IN_EXTRA_LIST = 2;
const FILM_COUNT = 14;
const FILM_COUNT_PER_STEP = 5;
const COMMENTS_COUNT = 50;
const bodyElement = document.querySelector('body');

const films = new Array(FILM_COUNT).fill().map(() => generateFilm(COMMENTS_COUNT));
const commentsList = new Array(COMMENTS_COUNT).fill().map((_,i) => generateComment(i));

const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');

render(siteMainElement, new SiteMenuView(films), RenderPosition.BEFOREEND);

const siteSortBlock = new SortBlockView();
const sectionFilmsComponent = new FilmListView();
const topRatedComponent = new TopRatedBlockView();
const mostCommentedComponent = new MostCommentedBlockView();

const renderFilmsBoard = () => {
  render(siteMainElement, siteSortBlock, RenderPosition.BEFOREEND);
  render(siteMainElement, sectionFilmsComponent, RenderPosition.BEFOREEND);
  render(sectionFilmsComponent.getElement(), topRatedComponent, RenderPosition.AFTEREND);
  render(sectionFilmsComponent.getElement(), mostCommentedComponent, RenderPosition.AFTEREND);
};

if(films.length > 0) {
  renderFilmsBoard();
} else {
  render(siteMainElement, new EmptyListMessageView(), RenderPosition.BEFOREEND);
}

const siteFooterElement = document.querySelector('.footer');

render(siteFooterElement, new FooterStaticticsView(films), RenderPosition.BEFOREEND);

let popupComponent;
let onEscKeyDown = () => {};

const hidePopup = () => {
  bodyElement.classList.remove('hide-overflow');
  popupComponent.getElement().remove();
  popupComponent.removeElement();
  popupComponent = null;
  document.removeEventListener('keydown', onEscKeyDown);
};

onEscKeyDown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    hidePopup(onEscKeyDown);
  }
};

const showPopup = (filmDetails, comments) => {
  if (!popupComponent) {
    popupComponent = new PopupView(filmDetails, comments);
    render(siteFooterElement, popupComponent.getElement(), RenderPosition.AFTEREND);
    bodyElement.classList.add('hide-overflow');
    popupComponent.setOpenPopupClickHandler(hidePopup);
    document.addEventListener('keydown', onEscKeyDown);
  }
  else {
    popupComponent.getFilmDetails().getElement().remove();
    popupComponent.getComments().getElement().remove();
    popupComponent.setFilmDetails(filmDetails);
    popupComponent.setComments(comments);
  }
  const filmDetailsContainer = popupComponent.getElement().querySelector('.film-details__top-container');
  render(filmDetailsContainer, filmDetails.getElement(), RenderPosition.BEFOREEND);
  render(filmDetailsContainer, comments.getElement(), RenderPosition.BEFOREEND);
};

//Карточка фильма
const renderFilmCard = (filmsListElement, film, commentList) => {
  const filmCardComponent = new FilmCardView(film);
  const filmDetailsPopupComponent = new FilmDetailsPopupView(film);
  const commentsPopupComponet = new PopupCommentsView(commentList, film);

  filmCardComponent.setOpenCardClickHandler(() => {
    showPopup(filmDetailsPopupComponent, commentsPopupComponet);
  });

  render(filmsListElement, filmCardComponent, RenderPosition.BEFOREEND);
};

if (films.length > 0) {
  for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
    renderFilmCard(sectionFilmsComponent.getElement().querySelector('.films-list__container'), films[i], commentsList);
  }

  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const showMoreBtnComponent = new ShowMoretBtnView();
    render(sectionFilmsComponent.getElement().querySelector('.films-list'), showMoreBtnComponent, RenderPosition.BEFOREEND);

    showMoreBtnComponent.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();

      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) =>  renderFilmCard(sectionFilmsComponent.getElement().querySelector('.films-list__container'), film, commentsList));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        remove(showMoreBtnComponent);
      }
    });
  }
}

//Карточка topRated и mostCommented
if (films.length > 0) {
  const topRatedList = films.sort((a, b) => b.totalRating - a.totalRating);

  for (let i = 0; i < ITEMS_IN_EXTRA_LIST; i++) {
    renderFilmCard(topRatedComponent.getElement().querySelector('.films-list__container'), topRatedList[i], commentsList);
  }

  const mostCommentedList = films.sort((a, b) => b.comments.length - a.comments.length);

  for (let i = 0; i < ITEMS_IN_EXTRA_LIST; i++) {
    renderFilmCard(mostCommentedComponent.getElement().querySelector('.films-list__container'), mostCommentedList[i], commentsList);
  }
}
