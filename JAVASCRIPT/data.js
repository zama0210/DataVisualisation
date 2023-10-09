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

  const processingData = () =>
    Promise.all([
      d3.tsv("https://unpkg.com/world-atlas@1.1.4/world/50m.tsv"),
      d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json"),
    ]).then(([tsvData, topoJSONdata]) => {
      const rowById = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d;
        return accumulator;
      }, {});

      const countries = topojson.feature(
        topoJSONdata,
        topoJSONdata.objects.countries
      );

      countries.features.forEach((d) => {
        Object.assign(d.properties, rowById[d.id]);
      });

      return countries;
    });

  const colourLegend = (selection, props) => {
    const {
      colorScale,
      circleRadius,
      spacing,
      textOffset,
      backgroundRectWidth,
    } = props;

    const backgroundRect = selection.selectAll("rect").data([null]);
    const n = colorScale.domain().length;
    backgroundRect
      .enter()
      .append("rect")
      .merge(backgroundRect)
      .attr("x", -circleRadius * 2)
      .attr("y", -circleRadius * 2)
      .attr("rx", circleRadius * 2)
      .attr("width", backgroundRectWidth)
      .attr("height", spacing * n + circleRadius * 2)
      .attr("fill", "white")
      .attr("opacity", 0.8);

    const groups = selection.selectAll(".tick").data(colorScale.domain());
    const groupsEnter = groups.enter().append("g").attr("class", "tick");
    groupsEnter
      .merge(groups)
      .attr("transform", (d, i) => `translate(0, ${i * spacing})`);
    groups.exit().remove();

    groupsEnter
      .append("circle")
      .merge(groups.select("circle"))
      .attr("r", circleRadius)
      .attr("fill", colorScale);

    groupsEnter
      .append("text")
      .merge(groups.select("text"))
      .text((d) => d)
      .attr("dy", "0.32em")
      .attr("x", textOffset);
  };

  const svg = d3.select("svg");

  const projection = d3.geoNaturalEarth1();
  const pathGenerator = d3.geoPath().projection(projection);

  const g = svg.append("g");

  const colourLegendG = svg.append("g").attr("transform", `translate(40,310)`);

  g.append("path")
    .attr("class", "sphere")
    .attr("d", pathGenerator({ type: "Sphere" }));

  svg.call(
    d3.zoom().on("zoom", () => {
      g.attr("transform", d3.event.transform);
    })
  );

  const colorScale = d3.scaleOrdinal();

  // const colorValue = d => d.properties.income_grp;
  const colorValue = (d) => d.properties.economy;

  processingData().then((countries) => {
    colorScale
      .domain(countries.features.map(colorValue))
      .domain(colorScale.domain().sort().reverse())
      .range(d3.schemeSpectral[colorScale.domain().length]);

    colourLegendG.call(colourLegend, {
      colorScale,
      circleRadius: 8,
      spacing: 20,
      textOffset: 12,
      backgroundRectWidth: 235,
    });

    g.selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", pathGenerator)
      .attr("fill", (d) => colorScale(colorValue(d)))
      .append("title")
      .text((d) => d.properties.name + ": " + colorValue(d));
  });
})(topojson, d3);
