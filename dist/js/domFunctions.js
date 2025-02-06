import { clearSnowflakes, snowAnimation, rainAnimation } from "./precipitationAnim.js";

export const setPlaceHolderText = () => {
    const input = document.getElementById("searchBar__text");
    window.innerWidth < 400
     ? (input.placeholder = "City, State, Country")
     : (input.placeholder = "City, State, Country or Zip Code");
}

export const addSpinner = (element) => {
    animateButton(element);
    setTimeout(animateButton, 1000, element);
}

const animateButton = (element) => {
    element.classList.toggle('none');
    element.nextElementSibling.classList.toggle('block');
    element.nextElementSibling.classList.toggle('none');
}

export const displayError = (headerMsg, srMsg) => {
    updateWeatherLocationHeader(headerMsg);
    updateScreenReaderConfirmation(srMsg);
};

export const displayApiError = (statusCode) => {
    const properMsg = toProperCase(statusCode.message);
    updateWeatherLocationHeader(properMsg);
    updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
}

const toProperCase = (text) => {
    const words = text.split(' ');
    const properWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    })
    return properWords.join(' ');
}

const updateWeatherLocationHeader = (headerMsg) => {
    const h1 = document.getElementById("currentForecast__location");
    if (headerMsg.indexOf('Lat:') !== -1 && headerMsg.indexOf('Long:') !== -1) {
        const msgArray = headerMsg.split(' ');
        const mapArray = msgArray.map(msg => {
            return msg.replace(':', ": ");
        });
        const lat = mapArray[0].indexOf('-') === -1 ? mapArray[0].slice(0, 10) : mapArray[0].slice(0, 11);
        const lon = mapArray[1].indexOf('-') === -1 ? mapArray[1].slice(0, 11) : mapArray[1].slice(0, 12);
        h1.textContent = `${lat} • ${lon}`;
    } else {
        h1.textContent = headerMsg;
    }
    
};

export const updateScreenReaderConfirmation = (srMsg) => {
    document.getElementById("confirmation").textContent = srMsg;
};

export const updateDisplay = (weatherJson, locationObj) => {
    fadeDisplay();
    bgReset();
    clearDisplay();
    const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
    setBGImage(weatherClass);
    const screenReaderWeather = buildScreenReaderWeather(weatherJson, locationObj);
    updateScreenReaderConfirmation(screenReaderWeather);
    updateWeatherLocationHeader(locationObj.getName());
    // current conditions
    const ccArray = createCurrentConditionsDivs(weatherJson, locationObj.getUnit());
    displayCurrentConditions(ccArray);
    // six day forecast
    displaySixDayForecast(weatherJson);
    setFocusOnSearch();
    fadeDisplay();
};

const fadeDisplay = () => {
    const cc = document.getElementById("currentForecast");
    cc.classList.toggle('zero-vis');
    cc.classList.toggle('fade-in');
    const sixDay = document.getElementById("dailyForecast");
    sixDay.classList.toggle('zero-vis');
    sixDay.classList.toggle('fade-in');
};

const clearDisplay = () => {
    const currentConditions = document.getElementById("currentForecast__conditions");
    deleteContents(currentConditions);
    const sixDayForecast = document.getElementById("dailyForecast__contents");
    deleteContents(sixDayForecast);
};

const deleteContents = (element) => {
    let child = element.lastElementChild;
    while (child) {
        element.removeChild(child);
        child = element.lastElementChild;
    }
};

const getWeatherClass = (icon) => {
    console.log(icon);
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    const weatherLookup = {
        '01': 'clear',
        '09': 'rain',
        '10': 'rain',
        '11': 'rain',
        '13': 'snow',
        '50': 'fog',
    };
    let weatherClass;
    let weatherTime;
    if (weatherLookup[firstTwoChars]) {
        weatherClass = weatherLookup[firstTwoChars];
    } else {
        weatherClass = 'clouds';
    }
    if (lastChar === 'n') {
        weatherTime = 'night';
    } else {
        weatherTime = 'day';
    }
    console.log(weatherClass);

    return [weatherClass, weatherTime];
};

const setBGImage = (conditions) => {
    bgReset();
    document.documentElement.classList.add(conditions[0]);
    document.documentElement.classList.forEach(img => {
        if (img !== conditions[0]) {
            document.documentElement.classList.remove(img);
        }
    });
    if (conditions[1] === 'night') {
        document.documentElement.classList.add('night');
        document.documentElement.classList.remove(conditions[0]);
    }
    if (conditions[0] === 'clear' && conditions[1] === 'day') {
        // TODO: draw sun
    } else if (conditions[0] === 'snow') {
        snowAnimation();
    } else if (conditions[0] === 'rain') {
        rainAnimation();
    } else if (conditions[0] === 'clear' && conditions[1] === 'night') {
        // TODO: draw stars
    } else if (conditions[0] === 'fog') {
        // TODO: animate fog
    }

};

const bgReset = () => {
    clearSnowflakes();
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
    const location = locationObj.getName();
    const unit = locationObj.getUnit();
    const tempUnit = unit === 'metric' ? 'Celsius' : 'Fahrenheit';
    return `${weatherJson.current.weather[0].description} and ${Math.round(Number(weatherJson.current.temp))} degrees ${tempUnit} in ${location}`;
};

const setFocusOnSearch = () => {
    document.getElementById('searchBar__text').focus();
};

const createCurrentConditionsDivs = (weatherJson, unit) => {
    const tempUnit = unit === 'metric' ? 'C' : 'F';
    const windUnit = unit === 'metric' ? 'm/s' : 'mph';
    const icon = createMainImgDiv(weatherJson.current.weather[0].icon, weatherJson.current.weather[0].description);
    const temp = createElem('div', 'temp', `${Math.round(Number(weatherJson.current.temp))}°`, tempUnit);
    const properDesc = toProperCase(weatherJson.current.weather[0].description);
    const desc = createElem('div', 'desc', properDesc);
    const feels = createElem('div', 'feels', `Feels like ${Math.round(Number(weatherJson.current.feels_like))}°`, tempUnit);
    const maxTemp = createElem('div', 'maxTemp', `High: ${Math.round(Number(weatherJson.daily[0].temp.max))}°`, tempUnit);
    const minTemp = createElem('div', 'minTemp', `Low: ${Math.round(Number(weatherJson.daily[0].temp.min))}°`, tempUnit);
    const humidity = createElem('div', 'humidity', `Humidity: ${weatherJson.current.humidity}%`);
    const wind = createElem('div', 'wind', `Wind: ${Math.round(Number(weatherJson.current.wind_speed))} ${windUnit}`);
    return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
    const iconDiv = createElem('div', 'icon');
    iconDiv.id = 'icon';
    const faIcon = translateIconToFontAwesome(icon);
    faIcon.ariaHidden = true;
    faIcon.title = altText;
    iconDiv.appendChild(faIcon);
    return iconDiv;
};

const createElem = (elemType, divClassName, divText, unit) => {
    const div = document.createElement(elemType);
    div.className = divClassName;
    if (divText) {
        div.textContent = divText;
    }
    if (divClassName === 'temp') {
        const unitDiv = document.createElement('div');
        unitDiv.className = 'unit';
        unitDiv.textContent = unit;
        div.appendChild(unitDiv);
    }
    return div;
};

const translateIconToFontAwesome = (icon) => {
    const i = document.createElement('i');
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    switch (firstTwoChars) {
        case '01':
            if (lastChar === 'd') {
                i.classList.add('far', 'fa-sun');
            } else {
                i.classList.add('far', 'fa-moon');
            }
            break;
        case '02':
            if (lastChar === 'd') {
                i.classList.add('fas', 'fa-cloud-sun');
            } else {
                i.classList.add('fas', 'fa-cloud-moon');
            }
            break;
        case '03':
            i.classList.add('fas', 'fa-cloud');
            break;
        case '04':
            i.classList.add('fas', 'fa-cloud-meatball');
            break;
        case '09':
            i.classList.add('fas', 'fa-cloud-rain');
            break;
        case '10':
            if (lastChar === 'd') {
                i.classList.add('fas', 'fa-cloud-sun-rain');
            } else {
                i.classList.add('fas', 'fa-cloud-moon-rain');
            }
            break;
        case '11':
            i.classList.add('fas', 'fa-poo-storm');
            break;
        case '13':
            i.classList.add('far', 'fa-snowflake');
            break;
        case '50':
            i.classList.add('fas', 'fa-smog');
            break;
        default:
            i.classList.add('fas', 'fa-question-circle');
    };
    return i;
};

const displayCurrentConditions = (currentConditionsArray) => {
    const ccContainer = document.getElementById('currentForecast__conditions');
    currentConditionsArray.forEach(cc => {
        ccContainer.appendChild(cc);
    });
};

const displaySixDayForecast = (weatherJson) => {
    for (let i = 1; i <= 6; i++) {
        const dfArray = createDailyForecastDivs(weatherJson.daily[i]);
        displayDailyForecast(dfArray);
    }
};

const createDailyForecastDivs = (dayWeather) => {
    const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
    const dayAbbreviation = createElem('p', 'dayAbbreviation', dayAbbreviationText);
    const dayIcon = createDailyForecastIcon(dayWeather.weather[0].icon, dayWeather.weather[0].description);
    const dayHigh = createElem('p', 'dayHigh', `${Math.round(Number(dayWeather.temp.max))}°`);
    const dayLow = createElem('p', 'dayLow', `${Math.round(Number(dayWeather.temp.min))}°`);
    return [dayAbbreviation, dayIcon, dayHigh, dayLow];
};

const getDayAbbreviation = (dt) => {
    const date = new Date(dt * 1000);
    const utcString = date.toUTCString();
    return utcString.slice(0, 3).toUpperCase();
};

const createDailyForecastIcon = (icon, altText) => {
    const img = document.createElement('img');
    if (window.innerWidth < 768 || window.innerHeight < 1025) {
        img.src = `https://openweathermap.org/img/wn/${icon}.png`;
    } else {
        img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
    }
    img.alt = altText;
    return img;
};

const displayDailyForecast = (dfArray) => {
    const dayDiv = createElem('div', 'forecastDay');
    dfArray.forEach(el => {
        dayDiv.appendChild(el);
    });
    const dailyForecastContainer = document.getElementById('dailyForecast__contents');
    dailyForecastContainer.appendChild(dayDiv);
};