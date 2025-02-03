import fetch from "node-fetch";

const { WEATHER_API_KEY } = process.env;

export async function handler(event, context) {
    const params = JSON.parse(event.body);
    const { lat, lon, units } = params;
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
    try {
        const weatherStream = await fetch(url);
        const weatherJson = await weatherStream.json();
        return {
            statusCode: 200,
            body: JSON.stringify(weatherJson)
        };
    }
    catch (err) {
        return { statusCode: 422, body: err.stack };
    }
}

/* import fetch from "node-fetch";
const { WEATHER_API_KEY } = process.env;

export async function handler(event, context) {
    try {
        const params = JSON.parse(event.body);
        const { lat, lon, units } = params;
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
        console.log(`Request URL: ${url}`);
        
        const weatherStream = await fetch(url);
        if (!weatherStream.ok) {
            throw new Error(`Error: ${weatherStream.status} - ${weatherStream.statusText}`);
        }
        
        const weatherJson = await weatherStream.json();
        return {
            statusCode: 200,
            body: JSON.stringify(weatherJson)
        };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message, stack: err.stack }) };
    }
} */