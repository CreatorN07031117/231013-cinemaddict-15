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


const ITEMS_IN_EXTRA_LIST = 2;
const FILM_COUNT = 23;
const FILM_COUNT_PER_STEP = 5;
const COMMENTS_COUNT = 50;

const films = new Array(FILM_COUNT).fill().map(() => generateFilm(COMMENTS_COUNT));
const commentsList = new Array(COMMENTS_COUNT).fill();

for (let i = 0; i < commentsList.length; i++) {
  commentsList[i] = generateComment(i);
}


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');

const siteMainElement = document.querySelector('.main');

render (siteMainElement, createSiteMenuTemplate(films), 'beforeend');
render(siteMainElement, createSiteFiltersTemplate(), 'beforeend');
render(siteMainElement, createFilmsListTemplate(), 'beforeend');

const sectionFilms = siteMainElement.querySelector('.films');

render(sectionFilms, createTopRatedBlock(), 'beforeend');
render(sectionFilms, createMostCommentedBlock(), 'beforeend');

const sectionFilmsList = sectionFilms.querySelector('.films-list');
const filmsListContainer = sectionFilms.querySelectorAll('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(filmsListContainer[0], createFilmCardTemplate(films[i]), 'beforeend');
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(sectionFilmsList , createShowMoreBtn(), 'beforeend');

  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmsListContainer[0], createFilmCardTemplate(film), 'beforeend'));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const topRatedList = films.sort((a, b) => {
  if (a.total_rating > b.total_rating) {
    return -1;
  }
  if (a.total_rating < b.total_rating) {
    return 1;
  }
  return 0;
});


for (let i = 0; i < ITEMS_IN_EXTRA_LIST; i++) {
  render(filmsListContainer[1], createFilmCardTemplate(topRatedList[i]), 'beforeend');
}

const mostCommentedList = films.sort((a, b) => {
  if (a.comments.length > b.comments.length) {
    return -1;
  }
  if (a.comments.length < b.comments.length) {
    return 1;
  }
  return 0;
});


for (let i = 0; i < ITEMS_IN_EXTRA_LIST; i++) {
  render(filmsListContainer[2], createFilmCardTemplate(mostCommentedList[i]), 'beforeend');
}

const siteFooterElement = document.querySelector('.footer');

render(siteFooterElement, createFooterStatictics(films), 'beforeend');

const filmToPopup = films[0];

render(siteFooterElement, createFilmsDetailsPopup(filmToPopup), 'afterend');

const filmDetailsPopup = document.querySelector('.film-details');
render(filmDetailsPopup, createPopupComments(commentsList, filmToPopup), 'beforeend');
