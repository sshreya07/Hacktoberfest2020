//? VARIABLES
let lat;
let long;
let city = [];

let actualTemperatures = [];
let condition = [];

let latitudeElement = document.querySelector('.location .latitude');
let longitudeElement = document.querySelector('.location .longitude');
let currentConditionElement = document.querySelector('.condition');
let temperatureElement = document.querySelector('.temperature');

let placeholders = document.querySelectorAll('.placeholder');

console.log(actualTemperatures, condition);

let sources = [false, false, false, false]; //? For each data source (api), add a negative boolean.

//? FUNCTIONS
function addIfNumber(data, group) {
    if (typeof data == 'number') {
        group.push(data);
    };
};

/*function unixToTime(unix) {
    var time = new Date(unix*1000);
    var hours = time.getHours();
    var minutes = "0" + time.getMinutes();
    // var seconds = "0" + time.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2);
    return String(formattedTime);
};*/

function average(array) {
    var sum = 0;
    for( var i = 0; i < array.length; i++ ){
        sum += parseInt( array[i], 10 ); //! Don't forget to add the base!
    }

    var avg = sum/array.length;
    return avg;
};

function formatTemp(array) {
    var temperatureAverage = average(array);
    var temperature = (temperatureAverage - 32) * (5 / 9);

    return Math.round(temperature);
};

function setTrue() {
    sources.shift();
    sources.push(true);
};

function removeClasses(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.remove('placeholder')
  }
};

function checkLoad() {
    if (sources[0] == false || sources[1] == false || sources[2] == false) {
        setTimeout("checkLoad();", 100);
        return;
    } else {
        console.log("v1.0");

        removeClasses(placeholders);

        latitudeElement.textContent = String(parseFloat(lat.toFixed(4)));
        longitudeElement.textContent = String(parseFloat(long.toFixed(4)));        //? condition and location

        function outputCondition(text) {
            if (city[0] == "undefined") {
                currentConditionElement.textContent = "It is currently " + text + " with a temperature of "  + formatTemp(actualTemperatures) + "°C.";
            } else {
                currentConditionElement.textContent = "It is currently " + text + " in " + city[0] + " with a temperature of "  + formatTemp(actualTemperatures) + "°C.";
            }
        };

        if (condition[0] == "clear-day") {
            outputCondition("clear");
        } else if (condition[0] == "clear-night") {
            outputCondition("clear");
        } else if (condition[0] == "rain") {
            outputCondition("rainy");
        } else if (condition[0] == "sleet") {
            outputCondition("sleety");
        } else if (condition[0] == "wind") {
            outputCondition("windy");
        } else if (condition[0] == "fog") {
            outputCondition("foggy");
        } else if (condition[0] == "cloudy") {
            outputCondition("cloudy");
        } else if (condition[0] == "partly-cloudy-day") {
            outputCondition("partly cloudy");
        } else if (condition[0] == "partly-cloudy-night") {
            outputCondition("partly cloudy");
        } else {
            return;
        };
    }
};

window.addEventListener('load', ()=> {
    //? GEOLOCATION
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            long = position.coords.longitude;

            console.log(lat, long);

            const proxy = "https://cors-anywhere.herokuapp.com/";

            //?DARK SKY
            const darkSkyApi = `${proxy}https://api.darksky.net/forecast/8acaa4fd4fd3f0f3a0c2bec840b53cb1/${lat},${long}`;

            fetch(darkSkyApi)
            .then(response => {
                return response.json();
            })
            .then(darkSky => {
                //console.log(darkSky);

                let { temperature, icon} = darkSky.currently;

                addIfNumber(temperature, actualTemperatures);
                condition.push(icon);

                setTrue();
            })
            .catch((error) => {
                setTrue();
            });

            //?OPENWEATHER
            const openWeatherApi = `${proxy}https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=7ac70ad264964e7ecaf1ce122e5c0525&units=imperial`;

            fetch(openWeatherApi)
            .then(response => {
                return response.json();
            })
            .then(openWeather => {
                //console.log(openWeather);

                let { name } = openWeather;
                let { temp } = openWeather.main;

                city.push(name);
                addIfNumber(temp, actualTemperatures);

                setTrue();
            }).catch((error) => {
                setTrue();
            });

            //?ACCUWEATHER
            const accuWeatherKey = `${proxy}http://dataservice.accuweather.com/locations/v1/cities/geoposition/search.json?apikey=nhLGyi9B4iEKaTQptFWTcx7FBMlzWAlk&q=${lat},${long}`;

            fetch(accuWeatherKey)
            .then(response => {
                return response.json();
            })
            .then(accuWeatherKey => {
                let key = String(accuWeatherKey.Key);

                const accuWeatherApi = `${proxy}http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=nhLGyi9B4iEKaTQptFWTcx7FBMlzWAlk&details=true`;

                fetch(accuWeatherApi)
                .then(response => {
                    return response.json();
                })
                .then(accuWeather => {
                    //console.log(accuWeather);

                    let actualTemperature = accuWeather[0].Temperature.Imperial.Value;

                    addIfNumber(actualTemperature, actualTemperatures);

                    setTrue();
                }).catch((error) => {
                    setTrue();
                });

                //?WEATHERBIT
                const weatherbitApi = `${proxy}https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&key=f8d19ac7c1d44147a521f835a6a618ca&units=I`;

                fetch(weatherbitApi)
                .then(response => {
                    return response.json();
                })
                .then(weatherbit => {
                    //console.log(weatherbit);

                    let { app_temp } = weatherbit.data[0];

                    addIfNumber(app_temp, actualTemperatures);

                    setTrue();
                }).catch((error) => {
                    setTrue();
                });
            });
        });
    };
});
