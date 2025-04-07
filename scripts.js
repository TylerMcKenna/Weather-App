async function callAPI(location, date1, date2) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}/${date2}?unitGroup=us&include=days&elements=conditions,datetime,temp,windgust,windspeed,description,resolvedAddress&key=FNWD53K7LC58RZX68HC4QJCNV`;
    const response = await fetch(url, {mode: "cors"});

    if (response.status !== 200) {
        throw new Error(`Error Status: ${response.status}`);
    } else {
        const json = await response.json();
        return json;
    }
}

async function getWeather(location, date1 = "", date2 = "") {
    try {
        // default date1 to the current day otherwise the range would be the next 15 days
        if (date1 === "") {
            const today = new Date();
            date1 = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        }
        const weather = await callAPI(location, date1, date2);
        document.querySelector("#infoDisplay").textContent = "Query complete!";
        console.log(weather);
    } catch (error) {
        console.log(`Fetching weather with location "${location}", startDate "${date1}", and endDate "${date2}" failed: \n\t ${error.message}`);
    }
}