import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function AirPollution({ selectedLocation, backgroundImage }) {
  const [pollutionData, setPollutuonData] = useState(null);

  const apiKey = import.meta.env.VITE_KEY;

  const { image: backgroundImg } = backgroundImage;

  useEffect(() => {
    const fetchPollutionData = async (location) => {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/data/2.5/air_pollution`,
          {
            params: {
              lat: location.lat,
              lon: location.lon,
              appid: apiKey,
            },
          }
        );
        setPollutuonData(response.data);
      } catch (error) {
        console.error("Error fetching pollution data:", error);
      }
    };

    if (selectedLocation) {
      fetchPollutionData(selectedLocation);
    }
  }, [selectedLocation, apiKey]);

  if (!pollutionData) {
    return <div>Loading...</div>;
  }

  const { list } = pollutionData;
  if (!list || list.length === 0) {
    return <div>No pollution data available for this location.</div>;
  }
  useEffect;
  const { dt, main, components } = list[0];
  const { aqi } = main;
  let airQuality = null;
  let description = null;
  let backgroundClr = null;
  if (aqi) {
    switch (aqi) {
      case 1:
        airQuality = "Good";
        backgroundClr = "green";
        description =
          'The air quality is classified as "Good." This indicates that the air poses little or no risk to health, and air pollution levels are low.';
        break;
      case 2:
        airQuality = "Fair";
        backgroundClr = "yellow";
        description =
          'The air quality is categorized as "Fair." This suggests that there may be a slight increase in pollutants in the air, but it still remains within acceptable levels for most individuals.';
        break;
      case 3:
        airQuality = "Moderate";
        backgroundClr = "orange";
        description =
          'The air quality is labeled as "Moderate." This implies that there might be some health concerns for sensitive individuals, such as those with respiratory conditions, but the majority of the population should not be significantly affected.';

        break;
      case 4:
        airQuality = "Poor";
        backgroundClr = "red";
        description =
          'The air quality is marked as "Poor." This indicates that there is a notable amount of pollutants present in the air, which could potentially affect the health of everyone, particularly those with pre-existing health conditions.';

        break;
      case 5:
        backgroundClr = "purple";
        airQuality = "Very Poor";
        description =
          'The air quality is identified as "Very Poor." This suggests a high level of pollutants in the air, posing significant health risks to everyone, including healthy individuals.We advise to limit outdoor activities and take precautions when the air quality is very poor.';
        break;
      default:
        airQuality = null;
        break;
    }
  }
  return (
    <Flex
      w="17vw"
      h="17vw"
      background={`url(${backgroundImg.image})`}
      backgroundSize="cover"
      backgroundPosition="center"
      justifyContent="center"
      flexDir="column"
      borderRadius="10px"
      position="relative"
      shadow="5px"
      color="white"
    >
      <Text
        w="100%"
        background={`rgba(0, 0, 0, 0.3)`}
        justifyContent="center"
        alignItems="center"
        position="absolute"
        top="0"
        display="flex"
        flexDirection="column"
        textAlign="center"
        borderTopRadius="10px"
        padding="10px"
        boxSizing="border-box"
        fontSize="3xl"
      >
        Air quality {airQuality}
      </Text>
      <Box
        width="100%"
        height="4px"
        background={backgroundClr}
        position="absolute"
        top="60px"
      />{" "}
      <Flex
        justifyContent="space-evenly"
        alignItems="center"
        flexDirection="row"
        overflow="hidden"
      >
        <Text color="white" ml="5px">
          {description}
        </Text>
      </Flex>
    </Flex>
  );
}
