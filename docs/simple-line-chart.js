/**
 * Display a simple line chart.
 *
 * @param {string} source
 *   A location such as data/simple-line-chart.csv.
 * @param {string} xAxisLabel
 *   A x axis label such as "week".
 * @param {string} yAxisLabel
 *   A x axis label such as "amount".
 * @param {string} chartLocation
 *   An element on the page, often a div with an id, where the chart will be
 *   displayed.
 * @param {int} width
 *   Width of the chart.
 * @param {int} height
 *   Height of the chart.
 *
 * See https://d3-graph-gallery.com/graph/shape.html#myline.
 */
function simpleLineChart(source, xAxisLabel, yAxisLabel, chartLocation, width, height) {
  // create svg element:
  var svg = d3.select(chartLocation).append("svg").attr("width", width).attr("height", height)

  // Read the CSV file.
  const data = d3.csv(source, function(data) {
    // prepare a helper function
    var lineFunc = d3.line()
      .x(function(d) { return d[xAxisLabel] })
      .y(function(d) { return d[yAxisLabel] })

    // Add the path using this helper function
    svg.append('path')
      .attr('d', lineFunc(data))
      .attr('stroke', 'black')
      .attr('fill', 'none');
  });

}
