/**
 * Display a simple pie chart.
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
 * @param {int} margin
 *
 * See https://d3-graph-gallery.com/graph/shape.html#myline.
 */
function simplePieChart(
  source,
  xAxisLabel,
  yAxisLabel,
  chartLocation,
  width,
  height,
  margin
) {
  /*
    Create SVG element
    chartLocation is a selector string or a reference to an
    existing HTML element where the SVG will be inserted.
    For example, it might be a string like "#chart" to select
    an element with the ID chart.
  */
  const svg = d3.select(chartLocation).append("svg")
    /*
      Sets the width of the SVG element.
      Total width including margins then only x,y axis rendered completely inside chart.
    */
    .attr("width", width + margin.left + margin.right)
    /*
      Sets the height of the SVG element.
      Total height including margins then only x,y axis rendered completely inside chart.
    */
    .attr("height", height + margin.top + margin.bottom)
    /*
      append("g") Appends a group element (<g>) to the SVG container.
      Explanation:
          The <g> element is used to group other SVG elements
      together. It is often used to apply transformations and 
      styling to a collection of elements. By appending this 
      <g> element, you create a group that can be transformed or
      styled as a unit.
    */
    .append("g")
    /*
      .attr("transform", translate(${margin.left},${margin.top})): 
      Moves the group element to account for margins, so the
      actual chart area starts after the margin space.
    */
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const radius = Math.min(width, height) / 2;
    // Read the CSV file.
    d3.csv(source).then(function(data) {
      // Parse data: convert strings to numbers
      data.forEach(d => {
        // Convert week to number
        d.week = +d[xAxisLabel];
        // Convert amount to number
        d.amount = +d[yAxisLabel];
      });

      // Create a color scale
      // The color scale assigns colors to different segments.
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      // Create a pie chart layout
      // The pie function computes the angles for each segment based on the amount values.
      const pie = d3.pie().value(d => d.amount);

      // Create an arc generator
      // The arc function generates the path data for each slice.
      const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);

      // Create a label arc generator
      // The labelArc function helps place labels on the chart.
      const labelArc = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);

      // Append arcs
      // The arcs are appended to the SVG, each filled with a color. 
      const g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

      // The arcs are appended to the SVG, each filled with a color.
      g.append("path")
      .attr("d", arc)
      .style("fill", d => color(d.data.week));

      // Labels are added to the pie chart segments.
      g.append("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(d => `W${d.data.week}: ${d.data.amount}`);

      // Create a legend
      const legend = d3.select(".legend");
      data.forEach(d => {
          legend.append("div")
              .style("color", color(d.week))
              .text(`Week ${d.week}: ${d.amount}`);
      });
  }).catch(error => {
    console.error('Error loading or parsing data:', error);
  });

}
