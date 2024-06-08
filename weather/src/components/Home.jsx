import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Flex, background } from "@chakra-ui/react";
import NavBar from "./NavBar";
import Weather from "./Weather";
import AirPollution from "./AirPollution";

import axios from "axios";
import {
  faSun,
  faCloud,
  faCloudSun,
  faCloudRain,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import Forecast from "./Forecast";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState({
    image: "",
    icon: "",
  });
  const apiKey = import.meta.env.VITE_KEY;

  const fetchWeatherData = async (location) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: location.lat,
            lon: location.lon,
            appid: apiKey,
            units: "metric",
          },
        }
      );
      console.log(response.data);
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              name: "Current location",
            };
            setSelectedLocation(userLocation);
          },
          (error) => {
            console.error("Error getting user's location:", error);
            setSelectedLocation({
              lat: 40.7128,
              lon: -74.006,
              name: "New York",
            });
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setSelectedLocation({
          lat: 40.7128,
          lon: -74.006,
          name: "New York",
        });
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (weatherData) {
      console.log(weatherData);
      const localTime = getLocalTime(weatherData.timezone);
      const backgroundImg = getBackgroundImg(weatherData, localTime);
      setBackgroundImage({ image: backgroundImg });
      switch (weatherData.weather[0].icon) {
        case "01d":
          setBackgroundImage({ icon: faSun });
          console.log(backgroundImage);
          break;
        case "02d":
          setBackgroundImage((prevState) => ({
            ...prevState,
            icon: faCloudSun,
          }));
          break;
        case "03d":
        case "04d":
          setBackgroundImage((prevState) => ({ ...prevState, icon: faCloud }));
          break;
        case "09d":
        case "10d":
        case "11d":
          setBackgroundImage((prevState) => ({
            ...prevState,
            icon: faCloudRain,
          }));
          break;
        case "13d":
          setBackgroundImage((prevState) => ({
            ...prevState,
            icon: faSnowflake,
          }));
          break;
        default:
          setBackgroundImage((prevState) => ({ ...prevState, icon: null }));
      }
    }
  }, [weatherData]);

  const getLocalTime = (timezoneOffset) => {
    const utcTime = new Date();
    const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000);
    const localTimeOffset = localTime.getTimezoneOffset() * 60 * 1000;
    return new Date(localTime.getTime() + localTimeOffset);
  };

  const getBackgroundImg = (weatherData, localTime) => {
    if (!weatherData || !localTime) return { image: "" };

    const currentTime = localTime.getHours();
    const isDayTime = currentTime >= 6 && currentTime < 18;
    const isSunny =
      ["01d", "02d"].includes(weatherData.weather[0].icon) ||
      ["01n", "02n"].includes(weatherData.weather[0].icon);

    if (isDayTime) {
      if (isSunny) {
        return { image: "/src/components/images/dayClear.jpg" };
      }
      return { image: "/src/components/images/dayCloudy.jpg" };
    } else {
      if (isSunny) {
        return { image: "/src/components/images/clearNight.jpg" };
      }
      return { image: "/src/components/images/nightCloud.jpg" };
    }
  };

  return (
    <Flex
      h="100vh"
      w="100vw"
      background="linear-gradient(27deg, rgba(19,88,138,1) 0%, rgba(6,53,94,1) 60%)"
      alignItems="center"
      direction="column"
      overflow="hidden"
    >
      <NavBar onSelectLocation={setSelectedLocation} />
      <Divider paddingBottom="7vh" />
      <Flex direction="row" paddingTop="1vh">
        {selectedLocation && (
          <Flex direction="column" alignItems="center">
            <Weather
              selectedLocation={selectedLocation}
              weatherData={weatherData}
              backgroundImage={backgroundImage}
            />
            <Box mt={4} w="100%">
              <Forecast
                selectedLocation={selectedLocation}
                backgroundImage={backgroundImage}
              />
            </Box>
          </Flex>
        )}

        {selectedLocation && (
          <Flex ml={4} justifyContent="center" alignItems="flex-start">
            <AirPollution
              selectedLocation={selectedLocation}
              backgroundImage={backgroundImage}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
