const apiKey = "YwqTVOnuzH1enLJjupphAGv4E8yLgSIKewfsh9hI";
const testUrl = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=${apiKey}`;

// Fetch data from the API and log it to the console
fetch(testUrl)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) =>
    console.error("An error occurred while fetching CME data:", error)
  );
