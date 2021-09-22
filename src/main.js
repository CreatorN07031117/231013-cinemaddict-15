import FooterStaticticsView from './view/site-footer-statistic.js';
import FilmsPresenter from './presenter/films.js';
import FilterMenuPresenter from './presenter/filter.js';
import {generateFilm} from './mock/film-card-mock.js';
import {generateComment} from './mock/comments-mock.js';
import {render, RenderPosition} from './utils/render.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';


const FILM_COUNT = 50;
const COMMENTS_COUNT = 50;

const films = new Array(FILM_COUNT).fill().map(() => generateFilm(COMMENTS_COUNT));
const commentsList = new Array(COMMENTS_COUNT).fill().map((_,i) => generateComment(i));

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(commentsList);

const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteHeaderElement, siteMainElement, siteFooterElement, filmsModel, commentsModel, filterModel);
const filterMenuPresenter = new FilterMenuPresenter(siteMainElement, filterModel, filmsModel);

filterMenuPresenter.init();
filmsPresenter.init();

render(siteFooterElement, new FooterStaticticsView(films), RenderPosition.BEFOREEND);
