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
import {render, RenderPosition} from './utils.js';


const ITEMS_IN_EXTRA_LIST = 2;
const FILM_COUNT = 15;
const FILM_COUNT_PER_STEP = 5;
const COMMENTS_COUNT = 50;
const bodyElement = document.querySelector('body');

const films = new Array(FILM_COUNT).fill().map(() => generateFilm(COMMENTS_COUNT));
const commentsList = new Array(COMMENTS_COUNT).fill().map((_,i) => generateComment(i));

const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, new UserRankView().getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');

render(siteMainElement, new SiteMenuView(films).getElement(), RenderPosition.BEFOREEND);

const siteSortBlock = new SortBlockView();
const sectionFilmsComponent = new FilmListView();
const topRatedComponent = new TopRatedBlockView();
const mostCommentedComponent = new MostCommentedBlockView();

const renderFilmsBoard = () => {
  render(siteMainElement, siteSortBlock.getElement(), RenderPosition.BEFOREEND);
  render(siteMainElement, sectionFilmsComponent.getElement(), RenderPosition.BEFOREEND);
  render(sectionFilmsComponent.getElement(), topRatedComponent.getElement(), RenderPosition.AFTEREND);
  render(sectionFilmsComponent.getElement(), mostCommentedComponent.getElement(), RenderPosition.AFTEREND);
};

if(films.length > 0) {
  renderFilmsBoard();
} else {
  render(siteMainElement, new EmptyListMessageView().getElement(), RenderPosition.BEFOREEND);
}

const siteFooterElement = document.querySelector('.footer');

render(siteFooterElement, new FooterStaticticsView(films).getElement(), RenderPosition.BEFOREEND);

const popupComponent = new PopupView();

render(siteFooterElement, popupComponent.getElement(), RenderPosition.AFTEREND);
popupComponent.getElement().style.visibility = 'hidden';

//Карточка фильма
const renderFilmCard = (filmsListElement, film, commentList) => {
  const filmCardComponent = new FilmCardView(film);
  const filmDetailsPopupComponent = new FilmDetailsPopupView(film);
  const commentsPopupComponet = new PopupCommentsView(commentList, film);


  const showPopup = () => {
    popupComponent.getElement().innerHTML = '';
    popupComponent.getElement().style.visibility = 'visible';
    popupComponent.getElement().appendChild(filmDetailsPopupComponent.getElement());
    render(popupComponent.getElement(), commentsPopupComponet.getElement(), RenderPosition.BEFOREEND);
  };

  const hidePopup = () => {
    commentsPopupComponet.getElement().remove();
    popupComponent.getElement().removeChild(filmDetailsPopupComponent.getElement());
    popupComponent.getElement().style.visibility = 'hidden';
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      hidePopup();
      bodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };


  filmCardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    showPopup();
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);
  });

  filmCardComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    showPopup();
    bodyElement.classList.add('hide-overflow');
  });

  filmCardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    showPopup();
    bodyElement.classList.add('hide-overflow');
  });

  filmDetailsPopupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
    hidePopup();
    bodyElement.classList.remove('hide-overflow');
  });

  render(filmsListElement, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

if (films.length > 0) {
  for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
    renderFilmCard(sectionFilmsComponent.getElement().querySelector('.films-list__container'), films[i], commentsList);
  }

  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const showMoreBtnComponent = new ShowMoretBtnView();
    render(sectionFilmsComponent.getElement().querySelector('.films-list'), showMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

    showMoreBtnComponent.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();

      popupComponent.getElement().style.visibility = 'hidden';

      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) =>  renderFilmCard(sectionFilmsComponent.getElement().querySelector('.films-list__container'), film, commentsList));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        showMoreBtnComponent.getElement().remove();
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
