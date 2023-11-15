const apiKey = "Sa299kdvXScK6Wcy0lQlaVJnencvbsZoQeBqxSex";
const apiUrl =
  "https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=" +
  apiKey;

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("API Data:", data);

    // Check if the data array is not empty
    if (Array.isArray(data) && data.length > 0) {
      // Process the data and extract relevant information
      const spiralsData = data
        .map((entry) => {
          const cmeData = entry.cmeAnalyses;

          if (cmeData && cmeData.length > 0) {
            return {
              date: new Date(entry.activityStartTime),
              speed: cmeData[0].cmeSpeed,
              longitude: cmeData[0].cmeLongitude,
              latitude: cmeData[0].cmeLatitude,
            };
          } else {
            console.warn("Missing CME analysis data in entry:", entry);
            return null; // Skip this entry if CME analysis data is missing
          }
        })
        .filter((entry) => entry !== null); // Filter out entries with missing CME analysis data

      console.log("Processed Data:", spiralsData);

      // --- Unchanged Part ---
      // Continue with the rest of your code for rendering the visualizations

      // Set up the SVG container
      const width = 800;
      const height = 800;

      const svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      // Define scales
      const radiusScale = d3
        .scaleLinear()
        .domain([0, d3.max(spiralsData, (d) => d.speed)])
        .range([10, 200]);

      // Create a radial scale for positioning
      const radialScale = d3
        .scaleLinear()
        .domain([0, spiralsData.length])
        .range([0, 2 * Math.PI]);

      // Create a color scale based on speed
      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(spiralsData, (d) => d.speed)]);

      // Create a tooltip
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // Create spirals using D3.js
      const spiral = d3
        .lineRadial()
        .angle((d, i) => radialScale(i))
        .radius((d) => radiusScale(d.speed));

      svg
        .append("path")
        .datum(spiralsData)
        .attr("d", spiral)
        .attr("fill", "none")
        .attr("stroke", (d) => colorScale(d.speed))
        .attr("stroke-width", 2)
        .on("mouseover", (d) => {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
              `<strong>Date:</strong> ${d.date.toISOString()}<br><strong>Speed:</strong> ${
                d.speed
              } km/s`
            )
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });
      // -----------------------
    } else {
      console.error("Invalid data format:", data);
    }
  })
  .catch((error) => console.error("Error fetching data:", error));
