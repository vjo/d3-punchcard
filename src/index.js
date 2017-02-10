import d3 from 'd3';

const defaults = {
  target: 'svg',
  width: 800,
  height: 400, // (400 - 15) / 7?
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
  }

  init() {
    this.element = d3.select(this.target);
    this.offset = this.element.node().getBoundingClientRect();
    this.formatTime = d3.timeFormat(this.timeFormat);
  }
}

module.exports = Punchcard;
