import React from "react";
import { Flex } from "@chakra-ui/react";
import AutoSuggest from "./Autocomplete";

export default function NavBar({ onSelectLocation }) {
  return (
    <Flex
      as="nav"
      w="100vw"
      h={"7vh"}
      bg={"#022d50"}
      justifyContent="center"
      alignItems="center"
      position="fixed"
      top="0"
      zIndex="1"
    >
      <AutoSuggest onSelectLocation={onSelectLocation} />
    </Flex>
  );
}
