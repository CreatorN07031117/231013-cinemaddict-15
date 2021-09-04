import FooterStaticticsView from './view/site-footer-statistic.js';
import FilmsPresenter from './presenter/films.js'
import {generateFilm} from './mock/film-card-mock.js';
import {generateComment} from './mock/comments-mock.js';
import {render, RenderPosition, remove} from './utils/render.js';


const ITEMS_IN_EXTRA_LIST = 2;
const FILM_COUNT = 15;
const FILM_COUNT_PER_STEP = 5;
const COMMENTS_COUNT = 50;
const bodyElement = document.querySelector('body');

const films = new Array(FILM_COUNT).fill().map(() => generateFilm(COMMENTS_COUNT));
const commentsList = new Array(COMMENTS_COUNT).fill().map((_,i) => generateComment(i));

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const filmsPresenter = new FilmsPresenter(siteHeaderElement, siteMainElement, siteFooterElement);

filmsPresenter.init(films, commentsList);


render(siteFooterElement, new FooterStaticticsView(films), RenderPosition.BEFOREEND);
