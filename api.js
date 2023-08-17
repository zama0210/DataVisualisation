console.log("CORONAL MASS EJECTION ANALYSIS API");

fetch(
  "https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2016-09-01&endDate=2016-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=DEMO_KEY"
)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log(data);
  });
