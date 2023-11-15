const apiKey = "YCWVhz1RMYXTkNqcUaOn8JfGubpSlbMzIyi8FwH6";
const apiUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Log the API response for inspection

    if (data.length === 0) {
      console.error("No data to display");
      return;
    }

    // Process the data and create a timeline chart
    createTimelineChart("#timeline", data, {
      width: 800,
      height: 400,
      radius: 5,
    });
  })
  .catch((error) => console.error("Error fetching data:", error));

// Function to create a timeline chart
function createTimelineChart(selector, data, config) {
  const { width, height, radius } = config;

  // Parse date strings to Date objects
  const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

  // Extract relevant information from the API response
  const cmeEvents = data.map((event) => ({
    date: parseDate(event.activityStartTime),
    speed: event.cmeAnalyses[0].speed,
    halfAngle: event.cmeAnalyses[0].halfAngle,
    catalog: event.cmeAnalyses[0].catalog,
  }));

  // Check if cmeEvents is empty
  if (cmeEvents.length === 0) {
    console.error("No data to display");
    return;
  }

  // Create SVG container
  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // ... (rest of your chart creation code)

  // Create points on the timeline
  svg
    .selectAll("circle")
    .data(cmeEvents)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.speed))
    .attr("r", radius)
    .attr("fill", "steelblue")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  // Function to show tooltip on hover
  function handleMouseOver(event, d) {
    const tooltip = svg.append("g").attr("class", "tooltip");

    tooltip
      .append("rect")
      .attr("x", xScale(d.date) - 30)
      .attr("y", yScale(d.speed) - 40)
      .attr("width", 120)
      .attr("height", 30)
      .attr("fill", "white")
      .attr("stroke", "black");

    tooltip
      .append("text")
      .attr("x", xScale(d.date))
      .attr("y", yScale(d.speed) - 20)
      .attr("text-anchor", "middle")
      .text(`Speed: ${d.speed}`);
  }

  // Function to hide tooltip on mouseout
  function handleMouseOut() {
    d3.select(".tooltip").remove();
  }
}
