import AbstractView from './abstract.js';

const createPopup = () => '<section class="film-details"></section>';


export default class Popup extends AbstractView {
  getTemplate() {
    return createPopup();
  }
}
