(async () => {
    // Getting the data
    const data = await d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json");

    // Dimensions

    const width = 1000,
        height = 500,
        margin = {
            top: 50,
            left: 50,
            bottom: 100,
            right: 50
        }

    // Treemap

    const root = d3.hierarchy(data).sum(d => d.value);

    d3.treemap()
        .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
        .paddingTop(5)
        .paddingRight(5)
        .paddingInner(2.5)(root)

    const z = d3.scaleOrdinal()
        .domain(data.children.map(x => x.name))
        .range(d3.schemeSet1);

    // Tooltip

    const tooltip = d3.select("#chartArea")
        .append("div")
        .attr("id", "tooltip");

    const mouseover = (event, data) => {
        tooltip.style("opacity", 1)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
            .attr("data-value", data.data.value);
        tooltip.html(`<strong>Name: </strong>${data.data.name}<br><strong>Category: </strong>${data.data.category}<br><strong>Value: </strong>${data.data.value}`);
    }

    const mouseleave = () => {
        tooltip.style("opacity", 0);
    }

    // Rectangles

    const rectangles = g => g.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr("class", "tile")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("stroke", "#000")
        .style("fill", d => z(d.parent.data.name))
        .style("opacity", 1)
        .on("mouseover mousemove", mouseover)
        .on("mouseleave", mouseleave);

    // Legend

    const legend = g => g.append("g")
        .selectAll("rect")
        .data(root.data.children)
        .join("rect")
        .attr("class", "legend-item")
        .attr("x", (d, i) => margin.left + i * 50)
        .attr("y", height - margin.bottom + 25)
        .attr("width", 20)
        .attr("height", 20)
        .attr("stroke", "#000")
        .attr("fill", d => z(d.name))
        .style("opacity");

    const texts = g => g.append("g")
        .selectAll("text")
        .data(root.data.children)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", (d, i) => margin.left + i * 50 + 10)
        .attr("y", height - margin.bottom - 5 + 25)
        .text(d => d.name);




    // Plots

    const svg = d3.select("#chartArea")
        .append("svg")
        .attr("height", height)
        .attr("width", width);

    svg.call(rectangles);
    const legendCont = svg.append("g")
        .attr("id", "legend")

    legendCont.call(legend);
    legendCont.call(texts);




})();