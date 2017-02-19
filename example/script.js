var data = [{
  label: 'Monday',
  values: [0,0,0,0,0,0,0,0,4,22,0,0,0,0,0,1,0,0,4,9,8,2,7,3],
},{
  label: 'Tuesday',
  values: [0,0,0,0,0,0,0,0,6,21,0,0,0,1,0,0,0,1,4,9,5,4,6,6],
},{
  label: 'Wednesday',
  values: [2,0,0,0,0,2,0,0,4,29,2,0,0,0,0,0,0,1,9,9,7,4,4,10],
},{
  label: 'Thursday',
  values: [0,0,1,1,0,0,0,0,4,29,3,0,0,0,0,0,2,0,7,7,6,4,7,7],
},{
  label: 'Friday',
  values: [1,0,2,2,1,0,2,0,7,22,1,0,0,1,0,1,2,2,4,4,6,4,4,6],
},{
  label: 'Saturday',
  values: [3,0,2,2,1,0,0,0,0,2,1,3,5,1,2,6,1,8,4,5,3,1,0,4],
},{
  label: 'Sunday',
  values: [2,0,0,0,0,0,0,1,0,0,2,2,2,2,1,1,3,0,0,2,2,1,0,3],
}];

var chart0 = new punchcard({
  target: '#chart0',
  data: data,
});

var chart1 = new punchcard({
  target: '#chart1',
  data: data,
  width: 600,
  height: 400,
  maxDotRadius: 10,
  tickSize: 10,
  styles: {
    axisLine: { stroke: '#93a5cf', 'stroke-width': '2px' },
    rowTick: { stroke: '#93a5cf', 'stroke-width': '2px' },
    dot: { fill: '#fe6e86' },
    label: {
      fill: '#71be74',
      'text-anchor': 'start',
    },
    xAxisText: { stroke: '#93a5cf' },
  },
});
