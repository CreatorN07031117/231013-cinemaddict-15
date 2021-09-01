import AbstractView from './abstract.js';

const createFooterStatictics = (films) => (
  `<section class="footer__statistics">
    <p>${films.length} movies inside</p>
  </section>`
);

export default class FooterStatictics extends AbstractView {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createFooterStatictics(this._films);
  }
}
