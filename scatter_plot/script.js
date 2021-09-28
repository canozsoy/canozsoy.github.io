(async () => {
    const response = await axios.get("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");
    const data = response.data;
    console.log(data);

    const width = 750;
    const height = 375;
    const padding = 50;

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(String(d.Year))))
        .range([padding, width - padding]);

    const y = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(1970, 0, 1, 0, d.Time.substr(0, 2), d.Time.substr(3, 5))))
        .range([height - padding, padding]);

    const xAxis = (g) => g.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(d3.axisBottom(x));

    const yAxis = (g) => g.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(d3.axisLeft(y).tickFormat(d3.timeFormat('%M:%S')));

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip");

    const mouseover = (event, d) => {
        let htmlStr;
        d.Doping ? htmlStr = `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}<br><br>${d.Doping}` : htmlStr = `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}`;
        tooltip.style("opacity", 1)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px")
            .attr("data-year", d.Year)
            .html(htmlStr);
    }

    const mouseleave = () => {
        tooltip.style("opacity", 0);
    }

    const scatters = (g) => g.append("g")
        .attr("id", "dots")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(new Date(String(d.Year))))
        .attr("cy", d => y(new Date(1970, 0, 1, 0, d.Time.substr(0, 2), d.Time.substr(3, 5))))
        .attr("r", 5)
        .attr("fill", (d) => {
            return (d.Doping ? "#2e358e" : "#8e872e")

        })
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => new Date("1979-01-01T01:" + d.Time + ".000Z"))
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave);

    const legend = (g) => {
        const legendDiv = g.append("g")
            .attr("id", "legend")
            .attr("x", width - 4 * padding)
            .attr("y", height - 3 * padding)

        legendDiv.append("circle")
            .attr("cx", width - 4 * padding + 10)
            .attr("cy", height - 3 * padding + 10)
            .attr("r", 5)
            .attr("fill", "#2e358e");

        legendDiv.append("circle")
            .attr("cx", width - 4 * padding + 10)
            .attr("cy", height - 3 * padding + 40)
            .attr("r", 5)
            .attr("fill", "#8e872e");

        legendDiv.append("text")
            .attr("x", width - 4 * padding + 2 * 10)
            .attr("y", height - 3 * padding + 15)
            .text("Alleged Doping")

        legendDiv.append("text")
            .attr("x", width - 4 * padding + 2 * 10)
            .attr("y", height - 3 * padding + 45)
            .text("Not Alleged Dop.")
    }

    const svg = d3.select("#chart_div")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "title");

    svg.call(xAxis);
    svg.call(yAxis);
    svg.call(scatters);
    svg.call(legend);

})();