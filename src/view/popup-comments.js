import dayjs from 'dayjs';
import SmartView from './smart.js';
import {nanoid} from 'nanoid';

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
                <button id = "${comment.id}" class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};


const createPopupComments = (data, commentsElement) => `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.length}</span></h3>
      <ul class="film-details__comments-list">
        ${commentsElement}
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


export default class PopupComments extends SmartView {
  constructor(commentsList, film) {
    super();

    this._data = PopupComments.parseFilmCommentsToData(commentsList, film);
    this._comments = this._data.comments;

    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._commentEmotionChangeHandler = this._commentEmotionChangeHandler.bind(this);
    this._scrollPopupHandler = this._scrollPopupHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this.setCommentDeleteClickHandler = this.setCommentDeleteClickHandler.bind(this);
    this.setFormSubmitHandler = this.setFormSubmitHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    this._commentsElement = this._comments.map((comment) => commentTemplate(comment)).join('');
    return createPopupComments(this._data, this._commentsElement);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentTextInputHandler);
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._commentEmotionChangeHandler);
    this.getElement().addEventListener('scroll', this._scrollPopupHandler);
  }

  //Отправка формы
  _formSubmitHandler(evt) {
    if (evt.key === 'Enter' && evt.ctrlKey) {
      evt.preventDefault();

      const userComment = {
        id: nanoid(),
        author: 'Name',
        comment: this.getElement().querySelector('.film-details__comment-input').value,
        date: dayjs(),
        emotion: this._data.isEmotion,
      };

      this._comments = [...this._comments, userComment];
      this.updateData(
        { ...this._data, comments: this._comments, currentPosition: this.getElement().scrollTop },
      );
      this._callback.commentSubmit(PopupComments.parseDataToComments(this._data));
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.commentSubmit = callback;
    this.getElement().querySelector('.film-details__comments-wrap').addEventListener('keydown', this._formSubmitHandler);
  }

  // Удаление коммента
  _commentDeleteClickHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    const indexComment = this._comments.findIndex(comment => comment.id == evt.target.id);

    this._comments = [
      ...this._comments.slice(0, indexComment),
      ...this._comments.slice(indexComment + 1),
    ];
    
    evt.preventDefault();
    const currentPosition = this.getElement().scrollTop;
    this.getElement().scrollTop = this._data.currentPosition;
    this.updateData(
      { ...this._data, comments: this._comments},
    );
    this._callback.commentDeleteClick(PopupComments.parseDataToComments(this._data));

    this.getElement().scrollTo(0, currentPosition);
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.commentDeleteClick = callback;
    this.getElement().querySelectorAll('.film-details__comment-delete').forEach((deleteButton) =>
      deleteButton.addEventListener('click', this._commentDeleteClickHandler));
  }

  //Поле ввода
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

    this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
    this.setFormSubmitHandler(this._callback.commentSubmit);
  }


  reset(film) {
    this.updateData(
      PopupComments.parseFilmCommentsToData(film),
    );
  }

  //Входящие данные
  static parseFilmCommentsToData(commentsList, film) {
    const commentContent = film.comments.map((commentId) => commentsList[commentId]);

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
