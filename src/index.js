import {
  axisBottom,
  max,
  scaleSqrt,
  scaleTime,
  select,
  timeFormat,
  timeMinute,
} from 'd3';

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
};

class Punchcard {
  constructor(config) {
    this.set(config);
    this.init();
  }

  set(config) {
    Object.assign(this, defaults, config);
    this.heightRow = (this.height - this.margin.top) / this.data.length;
  }

  init() {
    this.element = select(this.target);

    this.element
      .style('width', `${this.width}px`)
      .style('height', `${this.height}px`);

    this.offset = this.element.node().getBoundingClientRect();

    this.formatTime = timeFormat(this.timeFormat);

    this.values = this.data.map(d => d.values);

    this.tooltip = select('body').append('div')
      .attr('class', 'tooltip')
      .style('display', 'none');

    this.x = scaleTime()
      .domain([new Date(2000, 0, 1), new Date(2000, 0, 2)])
      .range([0, (this.width - this.margin.left - this.margin.right)]);

    this.dotRadius = scaleSqrt()
      .domain([0, max(this.values, value => max(value))])
      .range([0, this.maxDotRadius]);

    this.drawRow(this.data);
    this.drawXAxis();
    this.drawYText();
    this.drawPointMarks(this.data);
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

    this.svg.append('line')
      .attr('class', 'axis-line')
      .attr('x1', 0 - this.margin.left)
      .attr('y1', this.heightRow + this.margin.bottom)
      .attr('x2', this.width - this.margin.left - this.margin.right)
      .attr('y2', (this.heightRow + this.margin.bottom) - 1);
  }

  drawYText() {
    this.svg.append('text')
      .attr('class', 'label')
      .attr('x', 0 - this.margin.left)
      .attr('y', this.heightRow - this.margin.bottom)
      .style('text-anchor', 'start')
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
      .attr('r', d => this.dotRadius(d))
      .attr('cx', 0)
      .attr('cy', this.heightRow - 18)
      .on('mouseover', this.mouseover.bind(this))
      .on('mouseout', () => this.tooltip.style('display', 'none'));

    this.marks.append('line')
      .attr('class', 'tick')
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

    this.tooltip.style('display', 'inline')
      .style('left', `${xPosition}px`)
      .style('top', `${yPosition}px`)
      .html(`<span>${data}</span>`);
  }
}

module.exports = Punchcard;
