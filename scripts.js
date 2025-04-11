const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "October", "December"];

async function callAPI(location, date1, date2) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}/${date2}?unitGroup=us&include=days&elements=conditions,datetime,tempmax,tempmin,temp,windgust,windspeed,description,resolvedAddress,preciptype,cloudcover&key=FNWD53K7LC58RZX68HC4QJCNV`;
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
    // setHours(0,0,0,0) is neccessary to use Epoch time, which is easier to manipulate.
    // If we do not reset the hours of the day, we end up getting the wrong day sometimes.
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
    document.querySelector(".todayHigh").textContent = `High: ${Math.round(today["tempmax"])}°`;
    document.querySelector(".todayLow").textContent = `Low: ${Math.round(today["tempmin"])}°`;
    document.querySelector(".weatherDescription").textContent = today["description"];

    // could be a function
    const precipitationType = today["preciptype"]
    let icon = "sun";
    if (today["cloudcover"] >= 70) {
        icon = "cloud"
    }
    if (precipitationType !== null) {
        // if rain is somewhere in the string
        if (precipitationType.indexOf("rain") !== -1) {
            icon = "rain"
        } else {
            icon = precipitationType;
        }
    }
    document.querySelector(`.mainIcon`).src = `./images/${icon}.png`

    // Remove today since we don't need it anymore
    days.splice(0, 1);

    for (let i = 0; i < days.length; i++) {
        const elementClasses = document.querySelector(`.day${i}`).className;
        const currentDay = days[i];

        const date = new Date(currentDay["datetime"]);
        const dayOfTheWeek = DAY_NAMES[date.getDay()];
        const monthAndDay = `${MONTH_NAMES[date.getMonth()]} ${date.getUTCDate()}`
        const high = `High: ${Math.round(currentDay["tempmax"])}°`;
        const low = `Low: ${Math.round(currentDay["tempmin"])}°`;
        
        const properties = ["dayOfTheWeek", "monthAndDay", "high", "low"];
        const values = [dayOfTheWeek, monthAndDay, high, low];
        let j = 0;
        for (const property of properties) {
            document.querySelector(`.${elementClasses} .${property}`).textContent = values[j++];              
        }

        // Defaulting to either sunny or cloudy
        let icon = "sun";
        if (currentDay["cloudcover"] >= 70) {
            icon = "cloud";
        }

        // Changing if we have precipitation
        const precipitationType = currentDay["preciptype"];
        console.log(precipitationType);
        if (precipitationType !== null) {
            // if rain is somewhere in the string
            if (precipitationType.indexOf("rain") !== -1) {
                icon = "rain"
            } else {
                icon = precipitationType;
            }
        }

        document.querySelector(`.${elementClasses} .icon`).src = `./images/${icon}.png`
    }
}

async function main() {
    const weather = await getWeather("Oklahoma City");
    updateWeatherPage(weather);
    console.log(Date(Date.now()).get);
}

main();