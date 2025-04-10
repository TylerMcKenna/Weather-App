async function callAPI(location, date1, date2) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}/${date2}?unitGroup=us&include=days&elements=conditions,datetime,temp,windgust,windspeed,description,resolvedAddress&key=FNWD53K7LC58RZX68HC4QJCNV`;
    console.log(url);
    const response = await fetch(url, {mode: "cors"});

    if (response.status !== 200) {
        throw new Error(`Error Status: ${response.status}`);
    } else {
        const json = await response.json();
        return json;
    }
}

// Want to let users choose dates but for now, not doing that
async function getWeather(location) {
    // Today, at the start of the day
    // This is neccessary to use Epoch time, which is cleaner.
    // If we do not go to the start of the day we may have our 
    // day round up to tomorrow.
    const now = new Date();
    now.setHours(0, 0, 0, 0)

    // 6.048e8 is a week in milliseconds
    const today = Math.floor(now.getTime() / 1000);
    const weekFromToday = Math.floor((now.getTime() + 6.048e8) / 1000);

    try {    
        const weather = await callAPI(location, today, weekFromToday);
        console.log(weather);
        return weather;
    } catch (error) {
        console.log(`Fetching weather with location "${location}", startDate "${today}", and endDate "${weekFromToday}" failed: \n\t ${error.message}`);
    }
}

function updateWeatherPage(weather) {
    // Sets current day's information
    const { address, resolvedAddress, days } = weather;
    
    const otherAddressInfo = resolvedAddress.slice(resolvedAddress.indexOf(",") + 2);
    const today = days[0];
    document.querySelector(".city").textContent = address;
    document.querySelector(".otherLocationDetails").textContent = otherAddressInfo;
    document.querySelector(".currentTemp").textContent = `${Math.round(today["temp"])}°`;

    // Remove today since we don't need it anymore
    days.splice(0, 1);

    for (let i = 0; i < days.length; i++) {
        const dayElement = document.querySelector(`.day${i}`);
        console.log(dayElement);                              
    }
}

async function main() {
    const weather = await getWeather("London");
    updateWeatherPage(weather);
    console.log(Date(Date.now()).get);
}

main();