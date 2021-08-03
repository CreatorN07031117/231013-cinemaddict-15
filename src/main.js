import {createUserRankTemplate} from './view/user-rank.js';

const render = (container, template, place) => {
    container.insertAdjacentHTML(place, template);
  };

const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');