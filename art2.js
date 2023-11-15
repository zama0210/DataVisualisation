const apiKey = "YCWVhz1RMYXTkNqcUaOn8JfGubpSlbMzIyi8FwH6";
const apiUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=${apiKey}`;

// Fetch data from the API
d3.json(apiUrl)
  .then((data) => {
    // Process the data
    const processedData = data.map((d) => ({
      type: d.type,
      speed: d.speed,
      note: d.note,
      time: d.time21_5, // Assuming time is in the time21_5 property
      latitude: d.latitude,
      longitude: d.longitude,
      halfAngle: d.halfAngle,
    }));

    // Set up the SVG canvas
    const width = 800;
    const height = 600;
    const svg = d3
      .select("#chart-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Define scales for bubble size and color
    const sizeScale = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, (d) => d.speed)])
      .range([5, 30]);

    // Create a d3-tip tooltip
    const tip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(
        (d) =>
          `<strong>Type:</strong> ${d.type}<br><strong>Speed:</strong> ${d.speed}<br><strong>Note:</strong> ${d.note}<br><strong>Time:</strong> ${d.time}<br><strong>Latitude:</strong> ${d.latitude}<br><strong>Longitude:</strong> ${d.longitude}<br><strong>Half Angle:</strong> ${d.halfAngle}`
      );

    // Call the tooltip on the SVG container
    svg.call(tip);

    // Create bubbles with tooltips
    svg
      .selectAll("circle")
      .data(processedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => Math.random() * (width - 100) + 50) // Random x position for demonstration
      .attr("cy", (d) => Math.random() * (height - 100) + 50) // Random y position for demonstration
      .attr("r", (d) => sizeScale(d.speed))
      .attr("fill", () => getRandomColor())
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("mouseover", tip.show) // Show the tooltip on mouseover
      .on("mouseout", tip.hide); // Hide the tooltip on mouseout
  })
  .catch((error) => console.error("Error fetching data:", error));

// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
