$(document).ready(function () {
    var searchBtn = $("#searchBtn");

    initLocalStorage();
    dispalySearchHist();
    //get city coordinates
    searchBtn.on("click", function () {
        console.log("you clicked me")
        var cityName = $("#userInput").val();
        var apiKey = "52f04e6fd328783214c8f922737d041b"
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&cnt=5&units=imperial&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (results) {
            $(".hide").attr("class", "row")
            console.log(results)
            var currentCityName = results.name;
            $("#currentCityName").text(currentCityName + " ");
            var currentWethIcon = results.weather[0].icon
            console.log(currentWethIcon)
            addToSearchHist(currentCityName)
            dispalySearchHist()
            console.log("the current city is: " + currentCityName)
            console.log(results.coord.lon)
            var currentCityLon = results.coord.lon
            console.log(results.coord.lat)
            var currentCityLat = results.coord.lat
            findWithCoords(currentCityLat, currentCityLon, apiKey)
            var currentCityDt = results.dt
            dateConverter(currentCityDt)
            console.log(currentCityDt)
        });

    });

    function findWithCoords(currentCityCoLat, currentCityCoLon, apiKey) {
        var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentCityCoLat + "&lon=" + currentCityCoLon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (results) {
            console.log(results)
            // var unixTime = results.current.dt;
            // var timezoneDiff = results.timezone_offset;
            // console.log(timezoneDiff)
            // var currentDt = unixTime + timezoneDiff
            // console.log(currentDt)
            // dateConverter(currentDt);
            var currentCityTemp = results.current.temp;
            $("#currentTemp").text("Temperature: " + currentCityTemp + " \u00B0F")
            var currentCityHum = results.current.humidity;
            $("#currentHumid").text("Humidity: " + currentCityHum + "%")
            var currentCityWinSpeed = results.current.wind_speed;
            $("#currentWind").text("Wind Speed: " + currentCityWinSpeed + " MPH")
            var currentCityUvi = results.current.uvi;
            $("#currentUvi").text("UV Index: " + currentCityUvi)

        })
    }

    //convertint unix time to actual date
    function dateConverter(dt) {
        var inMilliseconds = dt * 1000;
        var inDateFormat = new Date(inMilliseconds);
        console.log(inDateFormat)
        var currentIntMonth = inDateFormat.getMonth() + 1
        var currentIntDay = inDateFormat.getDate()
        var currentIntYear = inDateFormat.getFullYear()
        $("#currentCityName").append("<span>" + "(" + currentIntMonth + "/" + currentIntDay + "/" + currentIntYear + ")" + "</span>")
    }

    function initLocalStorage() {
        if (localStorage.getItem("prevCityWeatherSrch") === null) {
            localStorage.setItem("prevCityWeatherSrch", "[]");
        };
    };

    function addToSearchHist(newCityName) {
        var currentSrchHist = JSON.parse(localStorage.getItem("prevCityWeatherSrch"))
        console.log(typeof currentSrchHist)
        currentSrchHist.unshift(newCityName)
        localStorage.setItem("prevCityWeatherSrch", JSON.stringify(currentSrchHist))
    }

    function dispalySearchHist() {
        $("#searchHistory").text("")
        var currentSrchHist = JSON.parse(localStorage.getItem("prevCityWeatherSrch"))
        // currentSrchHist = currentSrchHist.split(",")
        console.log("this is a test" + currentSrchHist)
        for (i = 0; i < currentSrchHist.length; i++) {
            console.log(currentSrchHist[i])
            $("#searchHistory").append("<br>")
            var citySrchBtn = $("<button>")
            citySrchBtn.addClass("btn btn-info prvCity")
            citySrchBtn.attr("type", "button")
            citySrchBtn.attr("city-name", currentSrchHist[i])
            citySrchBtn.text(currentSrchHist[i])
            $("#searchHistory").append(citySrchBtn)
            if ([i] > 5) {
                return
            }

        }
    }

});