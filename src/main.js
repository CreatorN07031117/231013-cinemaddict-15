import {createUserRankTemplate} from './view/user-rank.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createSiteFiltersTemplate} from './view/site-filters.js';
import {createFilmsListTemplate} from './view/film-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreBtn} from './view/show-more-button.js';
import {createTopRatedBlock} from './view/top-rated-block.js';
import {createMostCommentedBlock} from './view/most-commented-block.js';
import {createFooterStatictics} from './view/site-footer-statistic.js';
import {createFilmsDetailsPopup} from './view/film-details-popup.js';
import {createPopupComments} from './view/popup-comments.js';
import {generateFilm} from './mock/film-card-mock.js';
import {generateComment} from './mock/comments-mock.js';


const ITEMS_IN_FILMS_LIST = 5;
const ITEMS_IN_EXTRA_LIST = 2;
const FILM_COUNT = 20;
const COMMENTS_COUNT = 50;

const films = new Array(FILM_COUNT).fill().map(() => generateFilm(COMMENTS_COUNT))
const commentsList = new Array(COMMENTS_COUNT).fill()

for (let i = 0; i < commentsList.length; i++) {
  commentsList[i] = generateComment(i)
}

console.log(films)

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');

const siteMainElement = document.querySelector('.main');

render (siteMainElement, createSiteMenuTemplate(), 'beforeend');
render(siteMainElement, createSiteFiltersTemplate(), 'beforeend');


render(siteMainElement, createFilmsListTemplate(), 'beforeend');


const sectionFilms = siteMainElement.querySelector('.films');

render(sectionFilms, createTopRatedBlock(), 'beforeend');
render(sectionFilms, createMostCommentedBlock(), 'beforeend');

const sectionFilmsList = sectionFilms.querySelector('.films-list');

render(sectionFilmsList , createShowMoreBtn(), 'beforeend');

const filmsListContainer = sectionFilms.querySelectorAll('.films-list__container');

for (let i = 0; i < ITEMS_IN_FILMS_LIST; i++) {
  render(filmsListContainer[0], createFilmCardTemplate(films[i]), 'beforeend');
}

for (let i = 0; i < ITEMS_IN_EXTRA_LIST; i++) {
  render(filmsListContainer[1], createFilmCardTemplate(films[i]), 'beforeend');
}

for (let i = 0; i < ITEMS_IN_EXTRA_LIST; i++) {
  render(filmsListContainer[2], createFilmCardTemplate(films[i]), 'beforeend');
}

const siteFooterElement = document.querySelector('.footer');

render(siteFooterElement, createFooterStatictics(), 'beforeend');


render(siteFooterElement, createFilmsDetailsPopup(films[0]), 'afterend');

const filmDetailsPopup = document.querySelector('.film-details');
render(filmDetailsPopup, createPopupComments(commentsList, films[0].comments), 'beforeend');

