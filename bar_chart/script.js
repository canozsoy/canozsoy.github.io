let data;
(async () => {
    let res = await axios('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
    data = res.data.data;


    const padding = 50;
    const width = 1000;
    const height = 500;


    const svg = d3.select("#chart_div")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "title");

    const x = d3.scaleTime()
        .range([padding, width - padding])
        .domain(d3.extent(data, d => new Date(d[0])));

    const y = d3.scaleLinear()
        .range([height - padding, padding])
        .domain([0, d3.max(data, d => d[1])]);

    const xAxis = (g) => g.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(d3.axisBottom(x));

    const yAxis = (g) => g.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(d3.axisLeft(y));

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity", 0);

    const mouseover = (event, d) => {
        tooltip.style("opacity", 1)
            .attr("data-date", d[0])
            .html(`<strong>Date: </strong>${d[0]}<br><strong>GDP: </strong>${d[1]}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 20 + "px");
    }

    const mouseleave = () => {
        tooltip.style("opacity", 0);
    }

    const bars = (g) => g.append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(new Date(d[0])))
        .attr("y", (d) => y(d[1]))
        .attr("width", 2.5)
        .attr("height", (d) => y(0) - y(d[1]))
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("fill", "#2e358e")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave);

    svg.call(xAxis);

    svg.call(yAxis);

    svg.call(bars);


})();


