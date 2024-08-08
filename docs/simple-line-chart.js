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
 * @param {int} margin
 *   Margins provides padding around the chart.
 * @param {bool} displayXAxisPlotting
 *   If displayXAxisPlotting is true to then X axis displayed in chart.
 * @param {bool} displayYAxisPlotting
 *   If displayYAxisPlotting is true to then Y axis displayed in chart.
 *
 * See https://d3-graph-gallery.com/graph/shape.html#myline.
 */
function simpleLineChart(
  source,
  xAxisLabel,
  yAxisLabel,
  chartLocation,
  width,
  height,
  margin,
  displayXAxisPlotting,
  displayYAxisPlotting
) {

  // Create SVG element
  // chartLocation is a selector string or a reference to an
  // existing HTML element where the SVG will be inserted.
  // For example, it might be a string like "#chart" to select
  // an element with the ID chart.
  const svg = d3.select(chartLocation).append("svg")
    // Sets the width of the SVG element.
    // Total width including margins then only x,y axis rendered completely inside chart.
    .attr("width", width + margin.left + margin.right)
    // Sets the height of the SVG element.
    // Total height including margins then only x,y axis rendered completely inside chart.
    .attr("height", height + margin.top + margin.bottom)
    // append("g") Appends a group element (<g>) to the SVG container.
    // Explanation:
    //     The <g> element is used to group other SVG elements
    // together. It is often used to apply transformations and 
    // styling to a collection of elements. By appending this 
    // <g> element, you create a group that can be transformed or
    // styled as a unit.
    .append("g")
    // .attr("transform", translate(${margin.left},${margin.top})): 
    // Moves the group element to account for margins, so the
    // actual chart area starts after the margin space.
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Read the CSV file.
  const data = d3.csv(source, function (data) {
    // Parse data: convert strings to numbers
    data.forEach(d => {
      // Convert week to number
      d.week = +d[xAxisLabel];
      // Convert amount to number
      d.amount = +d[yAxisLabel];
    });

    // Create scales
    // d3.scaleLinear() is a function from D3.js that creates
    // a linear scale. Linear scales map numerical data values to
    // a continuous range of pixel values. It’s used for axes
    // where the data is distributed in a linear fashion.
    const xScale = d3.scaleLinear()
    // d3.extent(data, d => d[xAxisLabel]) calculates the 
    // extent (i.e., minimum and maximum) of the data values for 
    // the x-axis.
    // data is your dataset (an array of objects).
    //   d => d[xAxisLabel] is a function that extracts the value
    // corresponding to xAxisLabel from each data object. 
    // xAxisLabel should be a string representing the key for 
    // the x-axis data (e.g., "week").
    //   d3.extent returns an array with two values: the minimum 
    // and maximum values in the dataset for the specified key.
    // This array sets the domain of the scale.
      .domain(d3.extent(data, d => d[xAxisLabel]))
    // specifies the range of pixel values the data values will be mapped to.
    // [0, width] means that the smallest data value will be
    // mapped to pixel position 0, and the largest data value will
    // be mapped to pixel position width. If width is, 
    // for example, 730 pixels, then the data values will be 
    // mapped from 0 to 730 pixels along the x-axis.    
      .range([0, width]);

    // Linear scales map numerical data values to
    // a continuous range of pixel values 
    const yScale = d3.scaleLinear()
      // .domain([0, d3.max(data, d => d[yAxisLabel])]) sets the 
      // input domain of the scale. It starts from 0 (to include 
      // lower values) and goes up to the maximum value found in the 
      // dataset for the y-axis.
      .domain([0, d3.max(data, d => d[yAxisLabel])])
      // .range([height, 0]) sets the output range of the scale.
      // It maps data values to pixel positions on the y-axis, where 
      // height corresponds to the bottom of the chart and 0 
      // corresponds to the top. 
      .range([height, 0]);

    // Create line generator
    // line(), it will generate an SVG path string that
    // describes the line connecting all the data points, which
    // you can then append to the SVG to render the line chart.
    const line = d3.line()
    // .x(d => xScale(d[xAxisLabel])) sets the x-coordinate of the
    // line based on the xAxisLabel data.
    // d => d[xAxisLabel] is a function that extracts the value
    // for the x-axis from each data object. xAxisLabel should be
    // a string representing the key for the x-axis data
    // (e.g., "week").
    // xScale(d[xAxisLabel]) applies the xScale to the x-axis
    // value, converting it from data units to pixel units. This
    // maps the data value to a specific position along the x-axis.    
      .x(d => xScale(d[xAxisLabel]))
      .y(d => yScale(d[yAxisLabel]));

    // Append the line path
    // svg.append("path") creates a new <path> element within the
    // SVG container to represent the line chart.
    svg.append("path")
      // the data array to the path element, ensuring that the line
      // generator function has the data it needs to generate the path.
      .data([data])
      // .attr("class", "line") applies a CSS class to style the line.
      .attr("class", "line")
      // .attr('stroke', 'black') sets the color of the line.
      .attr('stroke', 'black')
      // .attr('fill', 'none') ensures no fill color inside the path.
      .attr('fill', 'none')
      // .attr("d", line) uses the line generator function to
      // generate the path data string for the line chart. 
      .attr("d", line);

      if (displayXAxisPlotting)
        // Append the x-axis to the SVG
        // A group element (<g>) for the x-axis is appended to the SVG.
        svg.append("g")
        // Move the x-axis to the bottom of the chart
        .attr("transform", `translate(0,${height})`)
        // Create and render the x-axis with ticks
        // d3.axisBottom(xScale) is used to generate the bottom axis,
        // and .ticks(data.length) customizes the number of ticks.
        // The axis is then rendered in the group element using .call()
        .call(d3.axisBottom(xScale).ticks(data.length));

    if (displayYAxisPlotting)
      // Append the y-axis to the SVG
      // A group element (<g>) for the y-axis is appended to the SVG.
      svg.append("g")
      // Create and render the y-axis
      // .call(d3.axisLeft(yScale)) generates and renders a vertical axis
      // on the left side of the chart based on the yScale.
      // This axis will have ticks and labels corresponding to the values
      // defined in yScale, helping to visually represent the y-values of your data.
      .call(d3.axisLeft(yScale));
  }).catch(error => {
    console.error('Error loading or parsing data:', error);
  });

}
