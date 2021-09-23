import FooterStaticticsView from './view/site-footer-statistic.js';
import FilmsPresenter from './presenter/films.js';
import FilterMenuPresenter from './presenter/filter.js';
import {render, RenderPosition} from './utils/render.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import {AUTHORIZATION, END_POINT, UpdateType} from './utils/const.js';
import Api from './api/api.js';


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteHeaderElement, siteMainElement, siteFooterElement, filmsModel, commentsModel, filterModel, api);
const filterMenuPresenter = new FilterMenuPresenter(siteMainElement, filterModel, filmsModel, filmsPresenter);


api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });


filterMenuPresenter.init();
filmsPresenter.init();

render(siteFooterElement, new FooterStaticticsView(filmsModel), RenderPosition.BEFOREEND);
