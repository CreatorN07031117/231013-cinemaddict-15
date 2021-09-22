import SmartView from './smart.js';
import {StatsType} from '../utils/const.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const createFilterItemTemplate = (filter, currentFilter) => {
  const {type, name} = filter;

  const checkedFilter = type === currentFilter
    ? `checked`
    : ``;

  return `
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${checkedFilter}>
      <label for="statistic-${type}" class="statistic__filters-label">${name}</label>
  `;
};

const createStatisticTemplate = (data, filters) => {
  const {
    watchedFilmsCount,
    userRank,
    totalDurationHours,
    totalDurationMinutes,
    topGenre,
    currentFilter
  } = data;

  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilter))
    .join(``);

  return `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRank}</span>
      </p>
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${filterItemsTemplate}
      </form>
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`;
};

export default class Statistic extends SmartView {
  constructor(data) {
    super();

    this._data = data;
    this._filters = this._getFilters();
    this._statisticChart = null;

    this._filterItemsChangeHandler = this._filterItemsChangeHandler.bind(this);

    this._setChart();
  }

  _filterItemsChangeHandler(evt) {
    this.callback.changeFilter(evt.target.value);
  }

  _getFilters() {
    return [
      {
        type: StatsType.ALL,
        name: `All time`
      },
      {
        type: StatsType.TODAY,
        name: `Today`
      },
      {
        type: StatsType.WEEK,
        name: `Week`
      },
      {
        type: StatsType.MONTH,
        name: `Month`
      },
      {
        type: StatsType.YEAR,
        name: `Year`
      }
    ];
  }

  _renderChart(statisticCtx, genresList) {
    return new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [...genresList.keys()],
        datasets: [{
          data: [...genresList.values()],
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  _setChart() {
    if (this._statisticChart !== null) {
      this._statisticChart = null;
    }

    const BAR_HEIGHT = 50;
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    const {genresList} = this._data;

    statisticCtx.height = BAR_HEIGHT * genresList.size;

    this._renderChart(statisticCtx, genresList);
  }

  getTemplate() {
    return createStatisticTemplate(this._data, this._filters);
  }

  removeElement() {
    super.removeElement();

    if (this._statisticChart !== null) {
      this._statisticChart = null;
    }
  }

  restoreHandlers() {
    this.setFilterItemsChangeHandler(this.callback.changeFilter);
    this._setChart();
  }

 /* setFilterItemsChangeHandler(callback) {
    this.callback.changeFilter = callback;

    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('change', this._filterItemsChangeHandler);
  }*/
}