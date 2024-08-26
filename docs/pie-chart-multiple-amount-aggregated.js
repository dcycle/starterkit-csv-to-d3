/**
 * Display a multiple amounts agregated pie chart.
 *
 * @param {string} source
 *   A location such as data/multivalued-1000-rows-20-columns.csv
 * @param {string} chartLocation
 *   An element on the page, often a div with an id, where the chart will be
 *   displayed.
 * @param {int} width
 *   Width of the chart.
 * @param {int} height
 *   Height of the chart.
 * @param {int} margin
 *   Margins provides padding around the chart.
 *
 * See https://d3-graph-gallery.com/graph/shape.html#myline.
 */
function multipleAmountsPieChart(
    source,
    chartLocation,
    width,
    height
) {
    // Create the SVG container
    // Select the element where the chart will be appended, and create an SVG element
    const svg = d3.select(chartLocation).append('svg')
        // Set the width of the SVG element
        .attr('width', width)
        // Set the height of the SVG element
        .attr('height', height)
        // Append a 'g' (group) element to the SVG. This will be used to group and transform elements within the SVG.
        .append('g')
        // Apply a transformation to the group element to center it within the SVG
        .attr('transform', `translate(${width / 2}, ${height / 2})`);


    // Read the CSV file.
    d3.csv(source).then(data => {
        // Extract column names (all columns except the first one).
        const columns = Object.keys(data[0]).slice(1);

        /*
          Parse data: convert strings to numbers.
        */
        data.forEach(d => {
            columns.forEach(column => d[column] = +d[column]);
        });

        // Aggregate the sums of all keys.
        const aggregatedData = columns.reduce((acc, key) => {
            acc[key] = data.reduce((sum, curr) => sum + curr[key], 0);
            return acc;
        }, {});

        // Convert the aggregated data into a format suitable for D3 pie chart.
        const pieData = columns.map(key => ({
            category: key,
            value: aggregatedData[key]
        }));

        const radius = Math.min(width, height) / 2;

        // Create a pie chart layout
        // The pie function computes the angles for each segment based on the amount values.
        const pie = d3.pie().value(d => d.value);
        // Create an arc generator.
        // The arc function generates the path data for each slice.
        const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);

        ///// Arc Labels /////
        // Label positioning
        const labelArc = d3.arc().outerRadius(radius-12).innerRadius(radius+2);

        // Select all elements with the class 'arc' within the SVG, which
        // will be used for the pie chart slices.
        const g = svg.selectAll('.arc')
            // Bind the data (pieData) to the selection, using the pie layout
            // function to compute the angles and positions.
            .data(pie(pieData))
            // Create a new 'g' (group) element for each data item. This is
            // where each pie slice will be drawn
            .enter().append('g')
            // Assign the class 'arc' to each group element. This allows styling
            // and manipulation of these elements later.
            .attr('class', 'arc');

        // Append a 'path' element to each 'g' group element. Each 'path' represents a slice of the pie chart
        g.append('path')
            // Set the 'd' attribute of the path to the value computed by the 'arc' function. This defines the shape of the pie slice
            .attr('d', arc)
            // Set the fill color of each path. Use a color from the d3.schemeCategory10 palette, which provides a range of colors
            // The index 'i' corresponds to the position of the current data item in the dataset
            .style('fill', (d, i) => d3.schemeSet3[i % d3.schemeSet3.length]);

        // Append a 'text' element to each 'g' group element. This will add
        // labels to each pie slice
        g.append('text')
            // Set the 'transform' attribute to position the text. Use the
            // 'arc.centroid(d)' function to get the coordinates of the center of each slice.
            .attr('transform', function(d) { return `translate(${labelArc.centroid(d)})`; })
            // Set the vertical alignment of the text. '.35em' adjusts the position
            // slightly to center the text vertically within the slice.
            .attr('dy', '.35em')
            // Set the text content of the text element. Display the category
            // and value from the data associated with each slice.
            .text(d => `${d.data.category}: ${d.data.value}`)
            // Align the text horizontally to the center. Ensures the text is centered
            // within the slice.
            .style('text-anchor', 'end')
            // Hide text initially.
            .style('visibility', 'hidden');

            // Added mouse events for interactivity.
            g.on('mouseover', function(event, d) {
                d3.select(this).select('text').style('visibility', 'visible');
            })
            .on('mouseout', function(event, d) {
                d3.select(this).select('text').style('visibility', 'hidden');
            });

    }).catch(error => {
        console.error('Error loading or parsing data:', error);
        d3.select(chartLocation).append('p').text('Failed to load data.').style('color', 'red');
    });
}
