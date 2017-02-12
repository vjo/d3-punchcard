# d3-punchcard

Github like punchcard build with [D3](https://d3js.org/).

![Chart screenshot][screenshot]

## Usage

Include the library in your page:
```html
<script src="punchcard.min.js"></script>
```

Add a HTML tag to attach the chart to:
```html
<svg id="chart"></svg>
```

Configure the chart:
```js
var chart = new punchcard({
  target: '#chart',
  data: data,
});
```

[screenshot]: https://github.com/vjo/d3-punchcard/blob/master/screenshot.png
