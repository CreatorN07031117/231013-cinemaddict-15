export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  UPDATE_FILMCARD: 'UPDATE_FILMCARD',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  ALL: 'all',
  WHATCHLIST: 'whatchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const MaxFilmsUserRank = {
  NO_RATING: 0,
  NOVICE: 10,
  FAN: 20,
};

export const StatsType = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};
