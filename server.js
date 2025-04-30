const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");

app.use(express.urlencoded())
app.use(session({
    secret: "jibblyjabblyjootungtungsahur",
    resave: false,
    saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.post("/weatherPage", (req, res) => {
    const city = req.body.city;

    if (!city) {
        res.redirect("/");
    }

    req.session.city = city
    res.redirect("/weatherPage");
})

app.get("/weatherPage", (req, res) => {
    if (!req.session.city) {
        res.redirect("/");
    }

    res.sendFile(path.join(__dirname, "pages", "weather.html"));
})

// anyone can request to this endpoint - probably not good
app.get("/weather/:location/:date1/:date2", async (req, res) => {
     try {
          const { location, date1, date2 } = req.params;
          const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${req.session.city}/${date1}/${date2}?unitGroup=us&include=days&elements=conditions,datetime,tempmax,tempmin,temp,windgust,windspeed,description,resolvedAddress,preciptype,cloudcover&key=FNWD53K7LC58RZX68HC4QJCNV`;
          const requestContent = await fetch(url, {mode: "cors"});
          const json = await requestContent.json();
          res.send(json)
     } catch (error) {
          console.log(`Error Status: ${requestContent.status} \n Error: ${error}`);
     }
});

app.listen(3000);