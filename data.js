(function (topojson, d3) {
  "use strict";
  const apiKey = "YwqTVOnuzH1enLJjupphAGv4E8yLgSIKewfsh9hI";
  const apiUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((apiData) => {
      if (Array.isArray(apiData)) {
        render(apiData);
      } else {
        console.error("Data format from the API is not as expected.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  const render = (apiData) => {
    const colorScale = d3.scaleOrdinal();

    const colorValue = (d) => d.speed; // Use the "speed" property for coloring

    colorScale
      .domain(apiData.map(colorValue))
      .domain(colorScale.domain().sort().reverse())
      .range(d3.schemeSpectral[colorScale.domain().length]);

    const svg = d3.select("svg");

    const projection = d3.geoNaturalEarth1();
    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append("g");

    g.append("path")
      .attr("class", "sphere")
      .attr("d", pathGenerator({ type: "Sphere" }));

    svg.call(
      d3.zoom().on("zoom", () => {
        g.attr("transform", d3.event.transform);
      })
    );

    // Load world map data (you can replace this with your map data)
    d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json").then(
      (world) => {
        const countries = topojson.feature(world, world.objects.countries);

        g.selectAll("path")
          .data(countries.features)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("d", pathGenerator)
          .attr("fill", (d) => {
            const apiCountryData = apiData.find((apiItem) => {
              return (
                apiItem.latitude === d3.geoCentroid(d)[1] &&
                apiItem.longitude === d3.geoCentroid(d)[0]
              );
            });

            return apiCountryData
              ? colorScale(colorValue(apiCountryData))
              : "gray"; // Use gray for countries with no data
          })
          .append("title")
          .text((d) => {
            const apiCountryData = apiData.find((apiItem) => {
              return (
                apiItem.latitude === d3.geoCentroid(d)[1] &&
                apiItem.longitude === d3.geoCentroid(d)[0]
              );
            });

            return apiCountryData
              ? `Country: ${d.properties.name}, Speed: ${apiCountryData.speed}`
              : "No data available";
          });
      }
    );
  };
})(topojson, d3);
(function (topojson, d3) {
  "use strict";
  const apiKey = "YwqTVOnuzH1enLJjupphAGv4E8yLgSIKewfsh9hI";
  const apiUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((apiData) => {
      if (Array.isArray(apiData)) {
        render(apiData);
      } else {
        console.error("Data format from the API is not as expected.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  const render = (apiData) => {
    const colorScale = d3.scaleOrdinal();

    const colorValue = (d) => d.speed; // Use the "speed" property for coloring

    colorScale
      .domain(apiData.map(colorValue))
      .domain(colorScale.domain().sort().reverse())
      .range(d3.schemeSpectral[colorScale.domain().length]);

    const svg = d3.select("svg");

    const projection = d3.geoNaturalEarth1();
    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append("g");

    g.append("path")
      .attr("class", "sphere")
      .attr("d", pathGenerator({ type: "Sphere" }));

    svg.call(
      d3.zoom().on("zoom", () => {
        g.attr("transform", d3.event.transform);
      })
    );

    // Load world map data (you can replace this with your map data)
    d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json").then(
      (world) => {
        const countries = topojson.feature(world, world.objects.countries);

        g.selectAll("path")
          .data(countries.features)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("d", pathGenerator)
          .attr("fill", (d) => {
            const apiCountryData = apiData.find((apiItem) => {
              return (
                apiItem.latitude === d3.geoCentroid(d)[1] &&
                apiItem.longitude === d3.geoCentroid(d)[0]
              );
            });

            return apiCountryData
              ? colorScale(colorValue(apiCountryData))
              : "gray"; // Use gray for countries with no data
          })
          .append("title")
          .text((d) => {
            const apiCountryData = apiData.find((apiItem) => {
              return (
                apiItem.latitude === d3.geoCentroid(d)[1] &&
                apiItem.longitude === d3.geoCentroid(d)[0]
              );
            });

            return apiCountryData
              ? `Country: ${d.properties.name}, Speed: ${apiCountryData.speed}`
              : "No data available";
          });
      }
    );
  };
})(topojson, d3);
