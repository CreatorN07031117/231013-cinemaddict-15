import AbstractView from './abstract.js';
import {pickUserRank} from '../utils/user-rank.js';

const createUserRankTemplate = (films) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${pickUserRank(films)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserRank extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createUserRankTemplate(this._films);
  }
}
