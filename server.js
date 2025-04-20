const express = require("express");
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "pages", "index.html"));
});

// anyone can request to this endpoint
app.get("/weather/:location/:date1/:date2", async (req, res) => {
     try {
          const { location, date1, date2 } = req.params;
          const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}/${date2}?unitGroup=us&include=days&elements=conditions,datetime,tempmax,tempmin,temp,windgust,windspeed,description,resolvedAddress,preciptype,cloudcover&key=FNWD53K7LC58RZX68HC4QJCNV`;
          const requestContent = await fetch(url, {mode: "cors"});
          const json = await requestContent.json();
          res.send(json)
     } catch (error) {
          console.log(`Error Status: ${requestContent.status} \n Error: ${error}`);
     }
});



app.listen(3000);