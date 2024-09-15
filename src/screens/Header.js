import {
    Flex,
    HStack,
    Icon,
    IconButton,
    Switch,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { FaBars, FaCoins, FaMoon, FaSun } from "react-icons/fa";

import { useSelector } from "react-redux";

const Header = ({ onOpen, colorMode, toggleColorMode }) => {
  const user = useSelector((state) => state.user);

  return (
    <Flex
      align="center"
      justify="space-between"
      p={4}
      bg={useColorModeValue("gray.100", "gray.700")}
    >
      <IconButton icon={<FaBars />} onClick={onOpen} aria-label="Open Menu" />
      <Text fontSize="3xl" fontWeight="bold">
        Snaily
      </Text>
      <Flex align="center">
        <HStack spacing={2} mr={4}>
          <Icon as={FaCoins} />
          <Text>{user.money}</Text>
        </HStack>
        <Icon as={colorMode === "light" ? FaSun : FaMoon} mr={2} />
        <Switch
          isChecked={colorMode === "dark"}
          onChange={toggleColorMode}
          size="lg"
          colorScheme="blue"
        />
      </Flex>
    </Flex>
  );
};

export default Header;
