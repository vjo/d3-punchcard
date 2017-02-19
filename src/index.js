import {
  axisBottom,
  max,
  scaleSqrt,
  scaleTime,
  timeFormat,
  timeMinute,
} from 'd3';
import { select } from 'd3-selection';
import 'd3-selection-multi';

const utils = {
  findAncestor(el, cls) {
    // eslint-disable-next-line
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  },
};

const defaults = {
  target: 'svg',
  width: 800,
  height: 400,
  margin: {
    top: 15,
    right: 0,
    bottom: 15,
    left: 100,
  },
  timeFormat: '%H',
  tickSize: 12,
  maxDotRadius: 14,
  data: undefined,
  styles: {
    axisLine: {
      stroke: '#B2B2B2',
    },
    rowTick: {
      stroke: '#B2B2B2',
    },
    dot: {
      fill: '#3E3E3E',
    },
    label: {
      fill: '#8A8A8A',
      'text-anchor': 'start',
    },
    xAxisText: {
      stroke: '#3E3E3E',
    },
    tooltipContainer: {
      display: 'none',
      position: 'absolute',
    },
    tooltip: {
      background: 'rgba(0, 0, 0, 0.8)',
      'border-radius': '4px',
      color: '#FFF',
      font: '10px sans-serif',
      height: '12px',
      'margin-top': '-42px',
      padding: '8px',
      'pointer-events': 'none',
      position: 'absolute',
      'text-align': 'center',
      width: '40px',
    },
    tooltipArrow: {
      'border-left': '6px solid transparent',
      'border-right': '6px solid transparent',
      'border-top': '6px solid rgba(0, 0, 0, 0.8)',
      height: '0',
      left: '22px',
      position: 'absolute',
      top: '-14px',
      width: '0',
    },
  },
};

class Punchcard {
  constructor(config) {
    this.set(config);
    this.init();
  }

  set(config) {
    Object.assign(this, defaults, config);
    this.styles = {
      ...defaults.styles,
      ...config.styles,
    };
    if (config.styles) {
      this.styles.tooltip = {
        ...defaults.styles.tooltip,
        ...config.styles.tooltip,
      };
      this.styles.tooltipArrow = {
        ...defaults.styles.tooltipArrow,
        ...config.styles.tooltipArrow,
      };
    }
    this.heightRow = (this.height - this.margin.top) / this.data.length;
  }

  init() {
    this.element = select(this.target)
      .styles({
        width: `${this.width}px`,
        height: `${this.height}px`,
      });

    this.offset = this.element.node().getBoundingClientRect();

    this.formatTime = timeFormat(this.timeFormat);

    this.values = this.data.map(d => d.values);

    this.x = scaleTime()
      .domain([new Date(2000, 0, 1), new Date(2000, 0, 2)])
      .range([0, (this.width - this.margin.left - this.margin.right)]);

    this.dotRadius = scaleSqrt()
      .domain([0, max(this.values, value => max(value))])
      .range([0, this.maxDotRadius]);

    this.initTooltip();
    this.drawRow(this.data);
    this.drawXAxis();
    this.drawYText();
    this.drawPointMarks(this.data);
  }

  initTooltip() {
    // XXX can not use :after pseudo selector so adding lot of divs
    this.tooltipContainer = select('body').append('div')
      .attr('class', 'tooltip-container')
      .styles(this.styles.tooltipContainer);

    this.tooltip = this.tooltipContainer.append('div')
      .attr('class', 'tooltip')
      .styles(this.styles.tooltip);

    this.tooltipContainer.append('div')
      .attr('class', 'tooltip-arrow')
      .styles(this.styles.tooltipArrow);
  }

  drawRow(data) {
    this.svg = this.element.selectAll('g')
      .data(data)
    .enter().append('g')
      .attr('class', 'row')
      .attr('width', this.width - this.margin.left - this.margin.right)
      .attr('height', this.heightRow)
      .attr('data-row', (d, i) => i)
      .attr('transform', (d, i) => `translate(${this.margin.left}, ${((this.heightRow * i) - this.margin.top)})`);
  }

  drawXAxis() {
    this.element.append('g')
      .attr('class', 'axis-label')
      .attr('transform', `translate(100, ${this.height - 20})`)
      .call(axisBottom(this.x)
        .ticks(timeMinute, 60)
        .tickFormat((interval, specifier) => {
          if (specifier === 24) { return null; }
          return this.formatTime(interval);
        })
        .tickPadding(4)
      );
    this.element.selectAll('line').remove();
    this.element.selectAll('.domain').remove();
    this.element.selectAll('text').styles(this.styles.xAxisText);

    this.svg.append('line')
      .attr('class', 'axis-line')
      .styles(this.styles.axisLine)
      .attr('x1', 0 - this.margin.left)
      .attr('y1', this.heightRow + this.margin.bottom)
      .attr('x2', this.width - this.margin.left - this.margin.right)
      .attr('y2', (this.heightRow + this.margin.bottom) - 1);
  }

  drawYText() {
    this.svg.append('text')
      .attr('class', 'label')
      .styles(this.styles.label)
      .attr('x', 0 - this.margin.left)
      .attr('y', this.heightRow - this.margin.bottom)
      .text(data => data.label);
  }

  // eslint-disable-next-line
  drawPointMarks(data) {
    this.marks = this.svg.selectAll('g')
        // eslint-disable-next-line
        .data(data => data.values)
      .enter().append('g')
        .attr('class', 'mark')
        .attr('transform', (d, i) => `translate(${this.x(new Date(2000, 0, 1, i))}, 0)`);

    this.marks.append('circle')
      .attr('class', 'dot')
      .styles(this.styles.dot)
      .attr('r', d => this.dotRadius(d))
      .attr('cx', 0)
      .attr('cy', this.heightRow - 18)
      .on('mouseover', this.mouseover.bind(this))
      .on('mouseout', () => this.tooltipContainer.style('display', 'none'));

    this.marks.append('line')
      .attr('class', 'row-tick')
      .styles(this.styles.rowTick)
      .attr('x1', 0)
      .attr('y1', this.heightRow + this.margin.bottom)
      .attr('x2', 0)
      .attr('y2', this.heightRow + this.margin.bottom - this.tickSize);
  }

  mouseover(data, pos, l) {
    const el = l[pos];
    const row = parseInt(utils.findAncestor(el, 'row').getAttribute('data-row'), 10);
    const xPosition = this.x(new Date(2000, 0, 1, pos))
      + this.margin.left
      - 20 /* half tooltip width */
      - 8 // XXX
      + this.offset.left;
    const yPosition = parseFloat((select(el).attr('cy')) * (1 + row))
      + ((this.margin.top + 3) * row)
      - this.dotRadius(data)
      - 8 // XXX
      + this.offset.top;

    this.tooltipContainer
      .styles({
        display: 'inline',
        left: `${xPosition}px`,
        top: `${yPosition}px`,
      });

    this.tooltip
      .html(`<span>${data}</span>`);
  }
}

module.exports = Punchcard;
