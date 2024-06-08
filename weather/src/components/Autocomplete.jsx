import React, { useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Box, Flex, Input, ListItem, UnorderedList } from "@chakra-ui/react";

const AutoSuggest = ({ onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: "json",
            namedetails: 1,
            limit: 5,
            accept_language: "en",
          },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchSuggestions(value);
  };

  const handleSelect = (suggestion) => {
    let coordinates = {
      lat: suggestion.lat,
      lon: suggestion.lon,
      name: suggestion.name,
    };
    setQuery(suggestion.display_name);
    setSuggestions([]);
    onSelectLocation(coordinates);
  };

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null;
    }

    return (
      <UnorderedList
        styleType="none"
        boxShadow="md"
        position="absolute"
        zIndex="999"
        left={'43.8%'}
        p={2}
        background="white" 
      >
        {suggestions.map((suggestion, index) => (
          <ListItem
            key={index}
            p={2}
            cursor="pointer"
            onClick={() => handleSelect(suggestion)}
            _hover={{ backgroundColor: "gray.100" }}
          >
            {suggestion.display_name.split(",").slice(0, 2).join(",")}
          </ListItem>
        ))}
      </UnorderedList>
    );
  };

  return (
    <Flex justifyContent="center" alignItems="center" flexDir="column">
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a location"
        color="white"  
        focusBorderColor="white"   
        zIndex="1" 
      />
      <Box>{renderSuggestions()}</Box>
    </Flex>
  );
};

export default AutoSuggest;
