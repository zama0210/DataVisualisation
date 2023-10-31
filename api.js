(function (d3) {
  "use strict";

  const svg = d3.select("svg");

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const render = (data) => {
    const title = "NASA CME Analysis";

    // Replace these data access functions with the appropriate ones for NASA API data
    const xValue = (d) => d.time;
    const xAxisLabel = "Time";

    const yValue = (d) => d.speed;
    const yAxisLabel = "Speed (km/s)";

    const margin = { top: 60, right: 40, bottom: 88, left: 105 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleTime()
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

    g.append("text").attr("class", "title").attr("y", -10).text(title);
  };

  // Fetch data from NASA API
  const apiKey = "YwqTVOnuzH1enLJjupphAGv4E8yLgSIKewfsh9hI";
  const apiUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=YwqTVOnuzH1enLJjupphAGv4E8yLgSIKewfsh9hI`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
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
