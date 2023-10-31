(function (d3) {
  "use strict";

  const svg = d3.select("svg");

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const render = (data) => {
    const title = "CMEs: Speed vs. Time";

    // Update data access functions and labels for speed vs. time
    const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
    const xValue = (d) => parseTime(d.time); // Assuming the time is provided in a format like "2023-10-31 12:00:00"
    const xAxisLabel = "Time";

    const yValue = (d) => d.speed; // Speed in km/s
    const circleRadius = 5;
    const yAxisLabel = "Speed (km/s)";

    const margin = { top: 60, right: 40, bottom: 88, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, xValue))
      .nice()
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, yValue)])
      .nice()
      .range([innerHeight, 0]);

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
      .attr("y", -93)
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
      .attr("y", 75)
      .attr("x", innerWidth / 2)
      .attr("fill", "black")
      .text(xAxisLabel);

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cy", (d) => yScale(yValue(d)))
      .attr("cx", (d) => xScale(xValue(d)))
      .attr("r", circleRadius);

    g.append("text").attr("class", "title").attr("y", -10).text(title);
  };

  const apiKey = "Sa299kdvXScK6Wcy0lQlaVJnencvbsZoQeBqxSex";
  const apiUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&catalog=ALL&api_key=${apiKey}`;

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
