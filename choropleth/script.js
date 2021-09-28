(async () => {
    // Get data
    const [countryData, educationData] = await Promise.all([
        d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"),
        d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    ]);
    // Prepare map object
    const data = new Map();
    educationData.forEach(x => data.set(x.fips, x.bachelorsOrHigher));

    // Define width and height

    const width = 1000,
        height = 700,
        margin = {
            top: 50,
            left: 50,
            bottom: 50,
            right: 50
        }

    // Prepare title
    const title = d3.select("#chartArea")
        .append("div")
        .attr("id", "title")

    title.append("h1")
        .html("U.S. Educational Attainment")

    title.append("h2")
        .attr("id", "description")
        .html("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");

    // Color scale 

    z = d3.scaleLinear()
        .domain(d3.extent(educationData, d => d.bachelorsOrHigher))
        .range(["#b5d1ff", "#002e78"]);

    // Mouse events

    const tooltip = d3.select("#chartArea")
        .append("div")
        .attr("id", "tooltip")

    const mouseover = (event, data) => {
        const { area_name, state } = educationData.filter(x => x.fips === data.id)[0];
        tooltip.style("opacity", 1)
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY + 5 + "px")
            .attr("data-education", data.total)
            .html(area_name + ", " + state + ", " + data.total.toString());
    }

    const mouseleave = () => {
        tooltip.style("opacity", 0);
    }

    // Legend

    const [minVal, maxVal] = d3.extent(educationData, x => x.bachelorsOrHigher);
    const ranges = d3.range(minVal, maxVal, 15);

    const boxes = (g) => g.append("g")
        .selectAll("rect")
        .data(ranges)
        .enter()
        .append("rect")
        .attr("x", (d, i) => margin.left + i * 30)
        .attr("y", () => height - margin.bottom * 1.2)
        .attr("height", 30)
        .attr("width", 30)
        .attr("fill", d => z(d))

    const texts = (g) => g.append("g")
        .selectAll("text")
        .data(ranges)
        .enter()
        .append("text")
        .attr("x", (d, i) => margin.left + i * 30 - 15)
        .attr("y", () => height - margin.bottom * 1.2 + 60)
        .text((d, i) => {
            if (i === ranges.length - 1) {
                return d.toFixed(1) + "+"
            } else {
                return d.toFixed(1)
            }
        })
        .style("font-size", "12px")

    const legendContainer = (g) => g.append("g")
        .attr("id", "legend")
        .call(boxes)
        .call(texts);


    // Prepare map         

    const baseMap = (g) => g.append("g")
        .selectAll("path")
        .data(topojson.feature(countryData, countryData.objects.counties).features)
        .join("path")
        .attr("class", "county")
        .attr("fill", d => {
            d.total = data.get(d.id) || 0;
            return z(d.total);
        })
        .attr("d", d3.geoPath())
        .attr("data-fips", d => d.id)
        .attr("data-education", d => data.get(d.id))
        .style("stroke", "#fff")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave);

    // Prepare svg and call functions

    const svg = d3.select("#chartArea")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.call(baseMap)
    svg.call(legendContainer)


})();

