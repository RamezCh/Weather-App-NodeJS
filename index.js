import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const yourAPIKey = "";
const weatherAPI_URL = `http://api.weatherstack.com/current?access_key=${yourAPIKey}`;
const locationAPI_URL = "http://ip-api.com/json/?fields=lat,lon,query";

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const userLocationResult = await axios.get(locationAPI_URL);
    const userLat = userLocationResult.data.lat;
    const userLon = userLocationResult.data.lon;
    const weatherData = await axios.get(
      weatherAPI_URL + `&query=${userLat},${userLon}&units=m`
    );
    const weatherResult = weatherData.data;

    res.render("index.ejs", {
      weatherDescription: weatherResult.current.weather_descriptions[0],
      cityName: weatherResult.location.region,
      temp: weatherResult.current.temperature,
      weatherIconUrl: weatherResult.current.weather_icons[0],
      humidity: weatherResult.current.humidity,
      windSpeed: weatherResult.current.wind_speed,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/submitCity", async (req, res) => {
  const cityName = req.body["cityName"];
  try {
    const weatherData = await axios.get(
      weatherAPI_URL + `&query=${cityName}&units=m`
    );

    const weatherResult = weatherData.data;
    res.render("index.ejs", {
      weatherDescription: weatherResult.current.weather_descriptions[0],
      cityName: weatherResult.location.region,
      temp: weatherResult.current.temperature,
      weatherIconUrl: weatherResult.current.weather_icons[0],
      humidity: weatherResult.current.humidity,
      windSpeed: weatherResult.current.wind_speed,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Server listening on port: ${port}`));
