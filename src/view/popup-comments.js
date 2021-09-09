import dayjs from 'dayjs';
import AbstractView from './abstract.js';

const EMOTION_PICTURES = {
  'smile': './images/emoji/smile.png',
  'sleeping': './images/emoji/sleeping.png',
  'puke': './images/emoji/puke.png',
  'angry': './images/emoji/angry.png'};

const commentTemplate = (review) => {
  const reviewDate = dayjs(review.date).format('M/D/YYYY H:mm');

  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
             <img src=${EMOTION_PICTURES[review.emotion]} width="55" height="55" alt="emoji-${review.emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${review.author}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${review.comment}</span>
                <span class="film-details__comment-day">${reviewDate}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};


const createPopupComments = (commentsList, film) => {
  const commentsIds = film.comments;
  const commentContent = commentsIds
    .map((commentId) => commentTemplate(commentsList[commentId]))
    .join('');

  return `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsIds.length}</span></h3>
      <ul class="film-details__comments-list">
        ${commentContent}
      </ul>

      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
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
};

export default class PopupComments extends AbstractView {
  constructor(commentsList, film) {
    super();

    this._film = film;
    this._commentsList = commentsList;
  }

  getTemplate() {
    return createPopupComments(this._commentsList, this._film);
  }
}
