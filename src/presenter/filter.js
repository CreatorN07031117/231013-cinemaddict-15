import {SortType, UpdateType, FilterType} from '../utils/const.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {filter} from '../utils/filters.js';
import SiteMenuView from '../view/site-menu.js';
import FilmsFilterView from '../view/site-filters.js';

export default class FilterMenu {
  constructor(mainBlock, filterModel, filmsModel) {
    this._mainBlock = mainBlock;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._siteMenuComponent = new SiteMenuView();

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    render(this._mainBlock, this._siteMenuComponent, RenderPosition.BEFOREEND);
    this._filterContainer = this._siteMenuComponent.getElement();

    this._filterComponent = new FilmsFilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._siteMenuComponent, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WHATCHLIST,
        name: 'Whatchlist',
        count: filter[FilterType.WHATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
