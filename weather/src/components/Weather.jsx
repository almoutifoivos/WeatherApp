import React from "react";
import { Flex, Text, Box } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faCloud } from "@fortawesome/free-solid-svg-icons";

const Weather = ({ selectedLocation, weatherData, backgroundImage }) => {
  const { image: backgroundImg, icon: weatherIcon } = backgroundImage;

  const weatherInfo = weatherData ? weatherData.weather[0] : null;
  if (!selectedLocation || !weatherData) {
    return <div>Loading weather data...</div>;
  }
  return (
    <Flex
      w="50vw"
      h="15vw"
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
        {selectedLocation.name}
      </Text>
      <Flex
        justifyContent="space-between"
        alignItems="flex-end"
        padding="10px"
        flex="1"
        position="relative"
      >
        <Box>
          <Text sx={{ fontSize: "6xl" }}>{weatherData.main.temp}°C</Text>
          <Text sx={{ fontSize: "xl" }}>
            {weatherInfo ? weatherInfo.main : ""}
          </Text>
          <Text sx={{ fontSize: "3xl" }}>
            Day {weatherData.main.temp_max}°C • Night{" "}
            {weatherData.main.temp_min}°C
          </Text>
          <Box>
            {weatherIcon && (
              <FontAwesomeIcon
                icon={weatherIcon === "faSun" ? faSun : faCloud}
              />
            )}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Weather;
