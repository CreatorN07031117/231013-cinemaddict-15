import FilmsModel from '../model/films.js';
import CommentsModel from '../model/comments.js';

const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _load({url, method = RequestMethod.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  addComment(comment, filmId) {
    return this._load({
      url: `comments/${filmId}`,
      method: RequestMethod.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then((response) => {
        return Object.assign(
            {},
            {
              movie: FilmsModel.adaptToClient(response.movie),
              comments: response.comments.map(CommentsModel.adaptToClient)
            }
        );
      })
    ;
  }

  static catchError(err) {
    throw err;
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  deleteComment(data) {
    return this._load({
      url: `comments/${data.commentId}`,
      method: RequestMethod.DELETE
    });
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(Api.toJSON)
      .then((comments) => comments.map(CommentsModel.adaptToClient));
  }

  getFilms() {
    return this._load({url: 'movies'})
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  static toJSON(response) {
    return response.json();
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: RequestMethod.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": 'application/json'})
    })
      .then(Api.toJSON);
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: RequestMethod.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({"Content-Type": 'application/json'})
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }
}