function refreshGraph() {
    // remove current graph
    d3.selectAll('svg').remove();

    // allow for domain adjusting
    let def_width = 0;
    if ($('#end').dropdown("get value") - $('#start').dropdown("get value") >= 70) {
        def_width = 2000;
    }
    else if ($('#end').dropdown("get value") - $('#start').dropdown("get value") >= 30) {
        def_width = 1500;
    }
    else if ($('#end').dropdown("get value") - $('#start').dropdown("get value") >= 10) {
        def_width = 1000;
    }
    else if ($('#end').dropdown("get value") - $('#start').dropdown("get value") >= 2) {
        def_width = 500;
    }
    else {
        def_width = 200;
    }

    // build window
    const margin = {top: 10, right: 30, bottom: 80, left: 80},
        width = def_width - margin.left - margin.right,
        height = 710 - margin.top - margin.bottom;
    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.05);
    const y = d3.scaleLinear()
        .range([height, 0]);

    // append the svg object to the body of the page
    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    d3.csv("assets/us-population-1990-to-2016.csv", function (d) {
        if (d.year >= $('#start').dropdown("get value") && d.year <= $('#end').dropdown("get value")) {
            return {
                year: d.year,
                population: d.population.substr(0, d.population.length === 9 ? 3 : 2)
            };
        }
    }).then(function (data) { //when promise returned

        // set the dimensions and margins of the graph
        x.domain(data.map(function(d) { return d.year; }));
        y.domain([0, 350]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.year); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.population); })
            .attr("height", function(d) { return height - y(d.population); });

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        svg.append('text')
            .attr('x', width/2)
            .attr('y', height + 50)
            .attr('text-anchor', 'middle')
            .text('Year')
        ;

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append('text')
            .attr('x', -(height / 2) - margin.top)
            .attr('y', -40)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('Population (Millions)')

    });
}