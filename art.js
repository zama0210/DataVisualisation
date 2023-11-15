if (typeof d3 === "undefined") {
  console.error("D3.js is not loaded. Check your script source.");
} else {
  console.log("D3.js is loaded!");
}
const apiKey = "Sa299kdvXScK6Wcy0lQlaVJnencvbsZoQeBqxSex";
const apiUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=${apiKey}`;

// Fetch data from the NASA DONKI API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Process the data and create an artistic D3.js chart
    createArt(data);
  })
  .catch((error) => console.error("Error fetching data:", error));

// Create an artistic D3.js chart
function createArt(data) {
  // Extract relevant information from the API response
  const cmeEvents = data.filter((event) => event.activityID);

  // Set up SVG dimensions
  const width = 800;
  const height = 400;

  // Create an SVG container
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#f0f0f0");

  // Create circles with varying sizes and delays
  svg
    .selectAll("circle")
    .data(cmeEvents)
    .enter()
    .append("circle")
    .attr("cx", width / 2) // Start all circles from the center horizontally
    .attr("cy", height / 2) // Start all circles from the center vertically
    .attr("r", (d) => d.speed / 5) // Set radius based on speed
    .attr("fill", "orange")
    .attr("opacity", 0.7);
}
