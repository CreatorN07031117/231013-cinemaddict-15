import AbstractView from './abstract.js';

const createFooterStatictics = (filmsCount) => (
  `<section class="footer__statistics">
    <p>${filmsCount} movies inside</p>
  </section>`
);

export default class FooterStatictics extends AbstractView {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatictics(this._filmsCount);
  }
}
