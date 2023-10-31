// Initialize the map with specific size
const map = L.map("map", {
  center: [0, 0],
  zoom: 2,
  maxBounds: [
    [-90, -180],
    [90, 180],
  ], // Restrict the map to the entire world
  maxBoundsViscosity: 1.0, // Adjust this value as needed
  maxZoom: 10,
  minZoom: 2,
  preferCanvas: true, // Optional, for better performance with many markers
  zoomControl: false, // Remove default zoom control
  scrollWheelZoom: false, // Disable scroll wheel zoom
});

// Add a tile layer (OpenStreetMap, you can choose different map providers)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//NASA API URL for CME Analysis
const apiKey = "YwqTVOnuzH1enLJjupphAGv4E8yLgSIKewfsh9hI";
const apiUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=${apiKey}`;

// Define a custom circular marker icon
const circleMarkerIcon = L.divIcon({
  className: "cme-marker",
  iconSize: [20, 20], // Size of the circle
  html: '<div class="cme-circle"></div>',
});

// Fetch data from the NASA API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Log the fetched data to the console

    // Process the CME data and create circular markers on the map
    data.forEach((cme) => {
      const latitude = cme.lat;
      const longitude = cme.long;

      if (latitude && longitude) {
        const marker = L.marker([latitude, longitude], {
          icon: circleMarkerIcon,
        }).addTo(map);
        marker.bindPopup(
          `CME Date: ${cme.activityID}<br>Speed: ${cme.speed} km/s`
        );
      }
    });
  })
  .catch((error) => {
    console.error("An error occurred while fetching CME data:", error);
  });

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
