import AbstractView from './abstract.js';

const createFilmsOnSite = (filmsCount) => (
  `<section class="footer__statistics">
    <p>${filmsCount} movies inside</p>
  </section>`
);

export default class FilmsOnSite extends AbstractView {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFilmsOnSite(this._filmsCount);
  }
}
