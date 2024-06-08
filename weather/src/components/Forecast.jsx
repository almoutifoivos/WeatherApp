import React, { useEffect, useState } from "react";
import { Flex, Box, Text, Divider } from "@chakra-ui/react";
import axios from "axios";

export default function Forecast({ selectedLocation, backgroundImage }) {
  const [forecastData, setForecastData] = useState(null);
  const { image: backgroundImg } = backgroundImage;

  const apiKey = import.meta.env.VITE_KEY;

  useEffect(() => {
    const fetchForecastData = async () => {
      if (!selectedLocation) return;

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast`,
          {
            params: {
              lat: selectedLocation.lat,
              lon: selectedLocation.lon,
              appid: apiKey,
              units: "metric",
            },
          }
        );
        console.log(response.data);
        setForecastData(response.data);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecastData();
  }, [selectedLocation, apiKey]);

  if (!forecastData) {
    return <div>Loading forecast data...</div>;
  }

  const forecastItems = forecastData.list
    .filter((_, index) => index % 8 === 0)
    .map((item, index) => {
      const date = new Date(item.dt * 1000);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return (
        <Flex
          background={`rgba(0, 0, 0, 0.3)`}
          key={index}
          p={1}
          m={2}
          border="1px solid black"
          borderRadius="10px"
          color="white"
          justifyContent="space-around" // or justifyContent="space-between"
          alignItems="center"
          textAlign="center"
        >
          <Text>{formattedDate}</Text>
          <Text>Temp: {item.main.temp}°C</Text>
          <Text>Weather: {item.weather[0].description}</Text>
          <Divider />
        </Flex>
      );
    });

  return (
    <Flex
      w="50vw"
      h="27vw"
      background={`url(${backgroundImg.image})`}
      backgroundSize="cover"
      backgroundPosition="center"
      justifyContent="space-evenly"
      flexDir="column"
      borderRadius="10px"
      position="relative"
      shadow="5px"
      color="black"
      overflow="hidden"
    >
      {forecastItems}
    </Flex>
  );
}
