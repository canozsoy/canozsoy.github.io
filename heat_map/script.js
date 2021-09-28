(async () => {
    const response = await axios.get("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");
    const data = response.data;

    const margin = {
        left: 100,
        right: 50,
        top: 50,
        bottom: 150,
    }

    const width = 1000;
    const height = 600;

    // Header

    const description = d3.select("#chart_div")
        .append("heading")
        .attr("id", "description");

    description.append("h1")
        .html("Monthly Global Land-Surface Temperature")
        .attr("class", "header");

    const [minYear, maxYear] = d3.extent(data.monthlyVariance, x => x.year);

    description.append("h2")
        .html(`${minYear} - ${maxYear}: Base temperature ${data.baseTemperature}&#8451; `)
        .attr("class", "header")
    // Tooltip and mouse events

    const tooltip = d3.select("#chart_div")
        .append("div")
        .attr("id", "tooltip")

    const mouseover = (event, d) => {
        const totalTemp = parseFloat(d.variance) + parseFloat(data.baseTemperature)
        tooltip.style("opacity", 1)
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY + 5 + "px")
            .attr("data-year", d.year)
            .attr("data-month", d.month)
            .html("<strong>Date: </strong>" + ticks[d.month - 1] + " - " + d.year + "<br><strong>Temp: </strong>" + totalTemp.toFixed(2) + "<br><strong>Var: </strong>" + d.variance.toFixed(2));
    }

    const mouseleave = () => tooltip.style("opacity", 0);

    // Axes

    const x = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data.monthlyVariance, d => d.month - 1))
        .range([height - margin.bottom, margin.top]);

    const colors = ["#a83232", "#3242a8"];
    const z = d3.scaleSequential()
        .domain(d3.extent(data.monthlyVariance, x => x.variance + data.baseTemperature))
        .interpolator(d3.interpolatePiYG);

    ticks = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const xAxis = (g) => g.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("")));

    const yAxis = (g) => g.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat((x) => ticks[x]));

    // Rectangles


    const rectangles = (g) => g.append("g")
        .attr("class", "rectangles")
        .selectAll("rect")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.month))
        .attr("height", d => y(d.month - 1) - y(d.month))
        .attr("width", d => (width - margin.left - margin.right) / (maxYear - minYear))
        .attr("fill", d => z(d.variance + data.baseTemperature))
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance + data.baseTemperature)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

    // Legend
    const [minVal, maxVal] = d3.extent(data.monthlyVariance, x => x.variance + data.baseTemperature);
    const ranges = d3.range(minVal, maxVal, 1);

    const boxes = (g) => g.append("g")
        .selectAll("rect")
        .data(ranges)
        .enter()
        .append("rect")
        .attr("x", (d, i) => margin.left + i * 40)
        .attr("y", () => height - margin.bottom * 0.8)
        .attr("height", 40)
        .attr("width", 40)
        .attr("fill", d => z(d))

    const texts = (g) => g.append("g")
        .selectAll("text")
        .data(ranges)
        .enter()
        .append("text")
        .attr("x", (d, i) => margin.left + i * 40 - 15)
        .attr("y", () => height - margin.bottom * 0.8 + 60)
        .text((d, i) => {
            if (i === ranges.length - 1) {
                return d.toFixed(1) + "+"
            } else {
                return d.toFixed(1)
            }
        })

    const legendContainer = (g) => g.append("g")
        .attr("id", "legend")
        .call(boxes)
        .call(texts);

    // Main plot

    const svg = d3.select("#chart_div")
        .append("svg")
        .attr("id", "title")
        .attr("width", width)
        .attr("height", height);

    svg.call(xAxis);
    svg.call(yAxis);
    svg.call(rectangles);
    svg.call(legendContainer);

})();