import {
  select,
  geoPath,
  geoNaturalEarth1,
  zoom,
  event,
  scaleOrdinal,
  schemeSpectral,
} from "d3";
import { processingData } from "./JAVASCRIPT/processingData.js";
import { colourLegend } from "./JAVASCRIPT/colourLegend.js";
import { choroplethMap } from "./JAVASCRIPT/choroplethMap.js";
const svg = select("svg");

const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);

const g = svg.append("g");

const colourLegendG = svg.append("g").attr("transform", `translate(40,310)`);

g.append("path")
  .attr("class", "sphere")
  .attr("d", pathGenerator({ type: "Sphere" }));

svg.call(
  zoom().on("zoom", () => {
    g.attr("transform", event.transform);
  })
);

const colorScale = scaleOrdinal();

// const colorValue = d => d.properties.income_grp;
const colorValue = (d) => d.properties.economy;

processingData().then((countries) => {
  colorScale
    .domain(countries.features.map(colorValue))
    .domain(colorScale.domain().sort().reverse())
    .range(schemeSpectral[colorScale.domain().length]);

  colourLegendG.call(colourLegend, {
    colorScale,
    circleRadius: 8,
    spacing: 20,
    textOffset: 12,
    backgroundRectWidth: 235,
  });

  choroplethMap.call(choroplethMap, {
    features,
    colorScale,
    colorValue,
    selectedColorValue,
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
