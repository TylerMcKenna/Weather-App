require("dotenv").config();
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

app.post("/weatherPage", async (req, res) => {
    const city = req.body.city;
    
    // Today, at the start of the day
    // setHours(0,0,0,0) is neccessary to use Epoch time, which is easier to manipulate.
    // If we do not reset the hours of the day, we end up getting the wrong day sometimes.
    const now = new Date();
    now.setHours(0, 0, 0, 0)
    
    // 6.048e8 is a week in milliseconds
    const today = Math.floor(now.getTime() / 1000);
    const weekFromToday = Math.floor((now.getTime() + 6.048e8) / 1000);
    
    try {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${today}/${weekFromToday}?unitGroup=us&include=days&elements=conditions,datetime,tempmax,tempmin,temp,windgust,windspeed,description,resolvedAddress,preciptype,cloudcover&key=${process.env.API_KEY}`;
        const requestContent = await fetch(url, {mode: "cors"});
        if (requestContent) {
            const json = await requestContent.json();
            req.session.cityInfo = json; 
        }
    } catch (error) {
        // console.log(`Error Status: ${requestContent.status} \n Error: ${error}`);
        res.redirect("/");
    }
    res.redirect("/weatherPage");
})

app.get("/weatherPage", (req, res) => {
    if (!req.session.cityInfo) {
        res.redirect("/");
    }

    res.sendFile(path.join(__dirname, "pages", "weather.html"));
});

app.get("/cityInfo", (req, res) => {
    res.send(req.session.cityInfo);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`)
});