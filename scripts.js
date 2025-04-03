async function callAPI(location, date1, date2) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}/${date2}?unitGroup=us&include=days&elements=conditions,datetime,temp,windgust,windspeed,description,resolvedAddress&key=FNWD53K7LC58RZX68HC4QJCNV`;
    try {
        const response = await fetch(url, {mode: "cors"});

        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        throw error;
    }
}

async function getWeather(location, date1 = "", date2 = "") {
    if (date1 === "") {
        const today = new Date();
        date1 = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    }
    const weather = await callAPI(location, date1, date2);
    console.log(weather);
}