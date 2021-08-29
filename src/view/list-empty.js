import AbstractView from './abstract.js';

const createEmptyListMessage = () => (
  `<section class="films-list">
  <h2 class="films-list__title">There are no movies in our database</h2>
  </section>`);

export default class EmptyListMessage extends AbstractView {
  getTemplate() {
    return createEmptyListMessage();
  }
}
