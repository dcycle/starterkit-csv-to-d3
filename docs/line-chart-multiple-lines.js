/**
 * Display a multiple line chart.
 *
 * @param {string} source
 *   A location such as data/line-chart-multiple-lines.csv.
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
 function multipleLineChart(source, chartLocation, width, height, margin) {
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
    .attr("transform", `translate(${margin.left},${margin.top})`);

    // Read the CSV file.
    d3.csv(source).then(function(data) {
        /*
            Parse data: convert strings to numbers
            week, amount1, amount2, amount3 are column names.
        */
        data.forEach(d => {
            d.week = +d.week;
            d.amount1 = +d.amount1;
            d.amount2 = +d.amount2;
            d.amount3 = +d.amount3;
        });

        /*
            Define scales and axes
            Create scales
            d3.scaleLinear() is a function from D3.js that creates
            a linear scale. Linear scales map numerical data values to
            a continuous range of pixel values. It’s used for axes
            where the data is distributed in a linear fashion.
        */
        const x = d3.scaleLinear()
        /*
            d3.extent(data, d => d[week]) calculates the 
            extent (i.e., minimum and maximum) of the data values for 
            the x-axis.
            data is your dataset (an array of objects).
            d => d[week] is a function that extracts the value
            corresponding to week from each data object. 
            d3.extent returns an array with two values: the minimum 
            and maximum values in the dataset for the specified key.
            This array sets the domain of the scale.
        */
        .domain(d3.extent(data, d => d.week))
        /*
            range specifies the range of pixel values the data values will be mapped to.
            [0, width] means that the smallest data value will be
            mapped to pixel position 0, and the largest data value will
            be mapped to pixel position width. If width is,
            for example, 730 pixels, then the data values will be
            mapped from 0 to 730 pixels along the x-axis.
        */
        .range([0, width]);

        /*
            Linear scales map numerical data values to
            a continuous range of pixel values 
        */
        const y = d3.scaleLinear()
        /*
            The .domain() method defines the input range for the scale.
            In this case, 0 is the minimum value, ensuring that the scale starts at zero.
            d3.max(data, d => Math.max(d.amount1, d.amount2, d.amount3)) calculates
            the maximum value of all the amounts across the data, ensuring that the
            scale can accommodate the highest value found in the dataset.
            This setup is particularly useful in line charts where you want the y-axis
            to dynamically adjust to the range of values in your data, ensuring that all
            lines fit well within the chart’s vertical space.
        */
        .domain([0, d3.max(data, d => Math.max(d.amount1, d.amount2, d.amount3))])
        /*
           .range([height, 0]) sets the output range of the scale.
           It maps data values to pixel positions on the y-axis, where 
           height corresponds to the bottom of the chart and 0 
           corresponds to the top.
        */
        .range([height, 0]);

        /*
            d3.axisBottom(x): Creates a bottom-oriented axis using the x scale.
            .ticks(data.length): Configures the axis to have tick marks for each
            data point in the dataset, which helps in clearly displaying and aligning
            the data points along the x-axis.
        */
        const xAxis = d3.axisBottom(x).ticks(data.length);
        /*
            d3.axisLeft(y): Creates a vertical axis positioned on the left side of the SVG,
            using the y scale function to map data values to pixel positions.
        */
        const yAxis = d3.axisLeft(y);

        /*
            The append('g') method adds a new group element to the SVG. This group element
            will contain all the parts of the x-axis (ticks, labels, etc.).
        */
        svg.append('g')
            .attr('class', 'x-axis')
            /*
                The transform attribute is used to position the axis correctly. By translating
                the group to the bottom of the SVG (translate(0,${height})), the x-axis is
                placed along the bottom edge of the chart area.
            */
            .attr('transform', `translate(0,${height})`)
            /*
                The .call(xAxis) method applies the axis generator to the group element. This
                method draws the x-axis based on the scale and configuration provided to
                d3.axisBottom(x).
            */
            .call(xAxis);

        // svg.append('g'): Adds a new group element to the SVG.
        svg.append('g')
            // .attr('class', 'y-axis'): Sets the class for CSS styling and targeting.
            .attr('class', 'y-axis')
            // .call(yAxis): Draws the y-axis using the yAxis generator function.
            .call(yAxis);
        /*
          Define line generators
          d3.line(): Creates a line generator function.
        */
        const line = d3.line()
            // .x(d => x(d.week)): Maps data values to x-coordinates using the x scale.
            .x(d => x(d.week))
            // .y(d => y(d.value)): Maps data values to y-coordinates using the y scale.
            .y(d => y(d.value));

        /*
            Create line paths.
            This code creates and configures three separate line paths for a line chart
            within the SVG element. Each line represents a different data series
            (amount1, amount2, amount3).        
        */            
        const amountLines = {
            amount1: svg.append('path')
                .attr('class', 'line')
                .attr('fill', 'none')
                .style('stroke', 'blue'),
            amount2: svg.append('path')
                .attr('class', 'line')
                .attr('fill', 'none')
                .style('stroke', 'red'),
            amount3: svg.append('path')
                .attr('class', 'line')
                .attr('fill', 'none')
                .style('stroke', 'green')
        };

        /*
            Update function for lines 
            The function first determines which lines should be visible based on the state
            of the checkboxes.
        */
        function updateLines() {
            const selectedLines = [];

            if (document.getElementById('checkbox-amount1').checked) {
                selectedLines.push({ key: 'amount1', color: 'blue' });
            }
            if (document.getElementById('checkbox-amount2').checked) {
                selectedLines.push({ key: 'amount2', color: 'red' });
            }
            if (document.getElementById('checkbox-amount3').checked) {
                selectedLines.push({ key: 'amount3', color: 'green' });
            }

            // It hides or shows each line accordingly.
            Object.keys(amountLines).forEach(key => {
                amountLines[key].style('display', selectedLines.find(l => l.key === key) ? null : 'none');
            });
            // It updates the path data and color of each visible line to reflect the current
            // data and styling preferences.
            selectedLines.forEach(lineData => {
                amountLines[lineData.key]
                    .datum(data.map(d => ({ week: d.week, value: d[lineData.key] })))
                    .attr('d', line)
                    .style('stroke', lineData.color);
            });
        }

        // Initial rendering of lines
        updateLines();

        // Add event listeners to checkboxes
        document.getElementById('checkbox-amount1').addEventListener('change', updateLines);
        document.getElementById('checkbox-amount2').addEventListener('change', updateLines);
        document.getElementById('checkbox-amount3').addEventListener('change', updateLines);        
    }).catch(error => {
        console.error('Error loading or parsing data:', error);
    });
 }
