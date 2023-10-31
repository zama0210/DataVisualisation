// Define the dimensions and margins for the heatmap
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Append an SVG element to the heatmap container
const svg = d3
  .select("#heatmap-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Define the color scale for the heatmap
const colorScale = d3.scaleSequential(d3.interpolateReds);

// Fetch data from the NASA API
const apiKey = "Sa299kdvXScK6Wcy0lQlaVJnencvbsZoQeBqxSex";
const apiUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=${apiKey}`;

d3.json(apiUrl).then((data) => {
  // Process the data and extract latitudes and longitudes
  const coordinates = data.map((d) => [d.latitude, d.longitude]);

  // Create a grid for the heatmap
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(coordinates, (d) => d[1]),
      d3.max(coordinates, (d) => d[1]),
    ])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(coordinates, (d) => d[0]),
      d3.max(coordinates, (d) => d[0]),
    ])
    .range([height, 0]);

  // Create a tooltip element
  const tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "5px")
    .style("border-radius", "3px")
    .style("display", "none");

  // Create a function to display the tooltip when hovering over a rectangle
  function showTooltip(d) {
    tooltip
      .html(`Latitude: ${d[0]}<br>Longitude: ${d[1]}`)
      .style("left", d3.event.pageX + 10 + "px")
      .style("top", d3.event.pageY - 30 + "px")
      .style("display", "block");
  }

  // Create a function to hide the tooltip when not hovering over a rectangle
  function hideTooltip() {
    tooltip.style("display", "none");
  }

  // Add interactivity to the rectangles
  svg
    .selectAll("rect")
    .data(coordinates)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d[1]))
    .attr("y", (d) => yScale(d[0]))
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", (d) => colorScale(Math.random()))
    .on("mouseover", showTooltip) // Show tooltip on hover
    .on("mousemove", showTooltip) // Follow the mouse
    .on("mouseout", hideTooltip); // Hide tooltip when not hovering
});

// Initialize the map
const map = L.map("map").setView([0, 0], 2); // Center the map at (0, 0) with zoom level 2

// Add a tile layer (you can use different tile providers)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
