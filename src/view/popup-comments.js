import SmartView from './smart.js';
import {convertDate} from '../utils/common.js';
import he from 'he';

const EMOTION_PICTURES = {
  'smile': './images/emoji/smile.png',
  'sleeping': './images/emoji/sleeping.png',
  'puke': './images/emoji/puke.png',
  'angry': './images/emoji/angry.png'};

const commentTemplate = (comment, deleting, disabled, deletedCommentId) => {
  const commentDate = convertDate(comment.date);

  deleting = deleting && comment.id === deletedCommentId;
  disabled = disabled && comment.id === deletedCommentId;
  const buttonText = deleting ? 'Deleting...' : 'Delete';

  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
             <img src=${EMOTION_PICTURES[comment.emotion]} width="55" height="55" alt="emoji-${comment.emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${commentDate}</span>
                <button id = "${comment.id}" class="film-details__comment-delete" ${disabled ? 'disabled' : ''}>${buttonText}</button>
              </p>
            </div>
          </li>`;
};

const createPopupComments = (data, commentsElement) => `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>
      <ul class="film-details__comments-list">
        ${commentsElement}
      </ul>
      <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${data.emotion ? `<img src="images/emoji/${data.emotion}.png" width="55" height="55" alt="emoji-${data.emotion}">` : ''}</div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${data.disabled ? 'disabled' : ''}>${he.encode(data.newComment)}</textarea>
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


export default class PopupComments extends SmartView {
  constructor(commentsList, film) {
    super();

    this._data = PopupComments.parseFilmCommentsToData(commentsList, film);
    this._comments = null;

    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._commentEmotionChangeHandler = this._commentEmotionChangeHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this.setCommentDeleteClickHandler = this.setCommentDeleteClickHandler.bind(this);
    this.setFormSubmitHandler = this.setFormSubmitHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    this._comments = this._data.comments;
    const deletedCommentId = this._data.deletedCommentId;

    this._commentsElement = this._comments.map((comment) => commentTemplate(comment, this._data.deleting, this._data.disabled, deletedCommentId)).join('');

    return createPopupComments(this._data, this._commentsElement);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentTextInputHandler);
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._commentEmotionChangeHandler);
  }

  _formSubmitHandler(evt) {
    if (evt.key === 'Enter' && evt.ctrlKey) {

      if (this._data.newComment === '' || this._data.emotion === null) {
        return;
      }

      evt.preventDefault();

      const userComment = {
        comment: this.getElement().querySelector('.film-details__comment-input').value,
        emotion: this._data.emotion,
      };

      this._callback.commentSubmit(userComment);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.commentSubmit = callback;
    this.getElement().querySelector('.film-details__comments-wrap').addEventListener('keydown', this._formSubmitHandler);
  }

  _commentDeleteClickHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();

    const deletedCommentId = evt.target.id;
    const currentPosition = this.getElement().scrollTop;
    this._callback.commentDeleteClick(deletedCommentId);
    this.getElement().scrollTo(0, currentPosition);
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.commentDeleteClick = callback;
    this.getElement().querySelectorAll('.film-details__comment-delete').forEach((deleteButton) =>
      deleteButton.addEventListener('click', this._commentDeleteClickHandler));
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
        emotion: evt.target.value,
      });
    }

    this.getElement().scrollTo(0, this._data.scrollPosition);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
    this.setFormSubmitHandler(this._callback.commentSubmit);
  }

  reset(commentsList, film) {
    this.updateData(
      PopupComments.parseFilmCommentsToData(commentsList, film),
    );
  }


  static parseFilmCommentsToData(commentsList, film) {

    const commentContent = film.comments.map((commentId) => commentsList.find((comment) => comment.id === commentId));

    const filmComments = {
      comments: commentContent,
    };

    return Object.assign(
      {},
      filmComments,
      {
        newComment: '',
        emotion: null,
        scrollPosition: 0,
        disabled: false,
        deleting: false,
        deletedCommentId: '',
      },
    );
  }

  static parseDataToComments(data) {
    data = Object.assign({}, data);

    if (!data.newComment) {
      data.newComment = '';
    }

    if (!data.emotion) {
      data.emotion = null;
    }

    delete data.newComment;
    delete data.emotion;
    delete data.disabled;
    delete data.deleting;
    delete data.deletedCommentId;

    return data;
  }
}
