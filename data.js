(function (d3) {
  "use strict";

  // Include d3-tip library
  const tip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html((d) => `Speed: ${d.speed} km/s<br>Half Angle: ${d.halfAngle}°`);

  const svg = d3.select("svg");

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  svg.call(tip);

  const render = (data) => {
    const title = "CMEs: Speed vs. Half Angle";

    // Replace these data access functions with the appropriate ones for NASA API data

    const xValue = (d) => d.halfAngle; //x-axis:Speed
    const circleRadius = 5;
    const xAxisLabel = "Half Angle (°)";

    const yValue = (d) => d.speed; // y-axis: Speed
    const yAxisLabel = "Speed (km/s)";

    const margin = { top: 60, right: 40, bottom: 88, left: 105 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
      .nice();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight).tickPadding(15);

    const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickPadding(10);

    const yAxisG = g.append("g").call(yAxis);
    yAxisG.selectAll(".domain").remove();

    yAxisG
      .append("text")
      .attr("class", "axis-label")
      .attr("y", -60)
      .attr("x", -innerHeight / 2)
      .attr("fill", "black")
      .attr("transform", `rotate(-90)`)
      .attr("text-anchor", "middle")
      .text(yAxisLabel);

    const xAxisG = g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0,${innerHeight})`);

    xAxisG.select(".domain").remove();

    xAxisG
      .append("text")
      .attr("class", "axis-label")
      .attr("y", 80)
      .attr("x", innerWidth / 2)
      .attr("fill", "black")
      .text(xAxisLabel);

    const lineGenerator = d3
      .line()
      .x((d) => xScale(xValue(d)))
      .y((d) => yScale(yValue(d)))
      .curve(d3.curveBasis);

    g.append("path").attr("class", "line-path").attr("d", lineGenerator(data));

    const circles = g
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(xValue(d)))
      .attr("cy", (d) => yScale(yValue(d)))
      .attr("r", circleRadius)
      .attr("fill", "#f84c0b")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    g.append("text").attr("class", "title").attr("y", -10).text(title);
  };

  // Fetch data from NASA API
  const apiKey = "YCWVhz1RMYXTkNqcUaOn8JfGubpSlbMzIyi8FwH6";
  const apiUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (Array.isArray(data)) {
        // Assuming the API response structure matches your provided structure
        render(data);
      } else {
        console.error("Data format from the API is not as expected.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
})(d3);
