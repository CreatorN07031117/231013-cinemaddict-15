import dayjs from 'dayjs';
import AbstractView from './abstract.js';

const EMOTION_PICTURES = {
  'smile': './images/emoji/smile.png',
  'sleeping': './images/emoji/sleeping.png',
  'puke': './images/emoji/puke.png',
  'angry': './images/emoji/angry.png'};

const commentTemplate = (comment) => {
  const commentDate = dayjs(comment.date).format('M/D/YYYY H:mm');

  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
             <img src=${EMOTION_PICTURES[comment.emotion]} width="55" height="55" alt="emoji-${comment.emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.author}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.comment}</span>
                <span class="film-details__comment-day">${commentDate}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};


const createPopupComments = (data) => `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.length}</span></h3>
      <ul class="film-details__comments-list">
        ${data.comments}
      </ul>

      <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${data.isEmotion ? `<img src="images/emoji/${data.isEmotion}.png" width="55" height="55" alt="emoji-${data.isEmotion}">` : ''}</div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${data.newComment}</textarea>
      </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>
    </section>
  </div> `;

export default class PopupComments extends AbstractView {
  constructor(commentsList, film) {
    super();

    this._data = PopupComments.parseFilmCommentsToData(film, commentsList);
    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._commentEmotionChangeHandler = this._commentEmotionChangeHandler.bind(this);
    this._scrollPopupHandler = this._scrollPopupHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupComments(this._data);
  }

  //Отправка формы
  /*_formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TaskEdit.parseDataToTask(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.film-details__new-comment').addEventListener('submit', this._formSubmitHandler);*/

  // Добавлены updateElement и updateData
  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }
    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentTextInputHandler);
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._commentEmotionChangeHandler);
    this.getElement().addEventListener('scroll', this._scrollPopupHandler);
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newComment: evt.target.value,
    }, true);
  }

  _commentEmotionChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName === 'INPUT') {
      this.updateData({
        isEmotion: evt.target.value,
      });
    }

    this.getElement().scrollTo(0, this._data.scrollPosition);
  }

  _scrollPopupHandler(evt) {
    this.updateData({
      scrollPosition: evt.target.scrollTop,
    }, true);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }


  reset(film, commentsList) {
    this.updateData(
      PopupComments.parseFilmCommentsToData(film, commentsList),
    );
  }

  //Входящие данные
  static parseFilmCommentsToData(film, commentsList) {
    const commentContent = film.comments
      .map((commentId) => commentTemplate(commentsList[commentId]))
      .join('');

    const filmComments = {
      comments: commentContent,
    };

    return Object.assign(
      {},
      filmComments,
      {
        newComment: '',
        isEmotion: null,
        scrollPosition: 0,
      },
    );
  }

  //Исходящие данные из комментария
  static parseDataToComments(data) {
    data = Object.assign({}, data);

    if (!data.newComment) {
      data.newComment = '';
    }

    if (!data.isEmotion) {
      data.isEmotion = null;
    }

    delete data.newComment;
    delete data.isEmotion;

    return data;
  }
}
