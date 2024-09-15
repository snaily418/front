import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Checkbox,
  Button,
  Input,
  useColorMode,
  useColorModeValue,
  IconButton,
  Stack,
  useColorModeValue as mode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Switch,
  Icon,
  Container,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Link,
  Divider,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Textarea,
  Editable,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaTrash,
  FaSun,
  FaMoon,
  FaBars,
  FaTasks,
  FaCog,
  FaCoins,
  FaComment,
} from "react-icons/fa";
import { BiEdit } from "react-icons/bi";

import Authorization from "./screens/Authorization";
import AddTabModal from "./screens/AddTabModal";
import Header from "./screens/Header";
import { useSelector } from "react-redux";
import Category from "./screens/Category";

function App() {
  const categories = useSelector((state) => state.categories);

  const { colorMode, toggleColorMode } = useColorMode();
  const [tabs, setTabs] = useState([
    { name: "Работа", tasks: [] },
    { name: "Личное", tasks: [] },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [newTask, setNewTask] = useState("");
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isAddTabButtonDisabled, setIsAddTabButtonDisabled] = useState(false);
  const [isAddTabModalOpen, setIsAddTabModalOpen] = useState(false); // Состояние для открытия и закрытия модального окна

  // Проверка, было ли уже показано окно регистрации
  useEffect(() => {
    const hasRegistered = localStorage.getItem("hasRegistered");
    if (!hasRegistered) {
      setIsRegistrationModalOpen(true);
    }
  }, []);

  const addTab = () => {
    if (tabs.length >= 10) {
      setIsAddTabButtonDisabled(true);
      return;
    }
    setIsAddTabModalOpen(true); // Открываем модальное окно для добавления новой вкладки
  };

  const deleteTab = (index) => {
    if (index < 2) return;
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    if (activeTab === index) {
      setActiveTab(0);
    }
    if (newTabs.length < 10) {
      setIsAddTabButtonDisabled(false);
    }
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTabs = [...tabs];
      newTabs[activeTab].tasks.unshift({
        text: newTask,
        completed: false,
        note: "",
      });
      setTabs(newTabs);
      setNewTask("");
    }
  };

  const handleTaskChange = (index, value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].tasks[index].text = value;
    setTabs(newTabs);
  };

  const handleKeyPressTask = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  const handleNoteChange = (index, value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].tasks[index].note = value;
    setTabs(newTabs);
  };

  const backgroundColor = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("black", "white");


  return (
    <Box>
      <Authorization
        isOpen={isRegistrationModalOpen}
        setIsOpen={setIsRegistrationModalOpen}
      />

      {/* Модальное окно для добавления новой вкладки */}
      <AddTabModal
        isOpen={isAddTabModalOpen}
        setIsOpen={setIsAddTabModalOpen}
      />

      <Flex direction="column" h="100vh">
        <Header
          onOpen={onOpen}
          toggleColorMode={toggleColorMode}
          colorMode={colorMode}
        />

        <Flex flex={1}>
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Меню</DrawerHeader>
              <DrawerBody>
                <VStack align="start" spacing={4}>
                  <Link
                    onClick={() => {
                      setActiveTab(0);
                      onClose();
                    }}
                  >
                    <HStack>
                      <Icon as={FaTasks} />
                      <Text>Задания</Text>
                    </HStack>
                  </Link>
                  <Link onClick={() => setIsRegistrationModalOpen(true)}>
                    <HStack>
                      <Icon as={FaCog} />
                      <Text>Настройки</Text>
                    </HStack>
                  </Link>
                </VStack>
              </DrawerBody>
              <div align="center">
                <Divider />
                <Text align="center" mb={5} mt={4}>
                  &copy; 2024 Snaily
                </Text>
              </div>
            </DrawerContent>
          </Drawer>

          <Container maxW="container.md" centerContent flex={1} p={4}>
            <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
              <TabList justifyContent="start" borderRadius="md">
                {categories.map((tab, index) => (
                  <Tab
                    key={index}
                    _selected={{ color: "white", bg: "#3884FD" }}
                    borderRadius="full"
                  >
                    {tab.title}
                    {!tab.permanent && (
                      <IconButton
                        icon={<FaTrash />}
                        size="xs"
                        ml={2}
                        onClick={() => deleteTab(tab.id)}
                        aria-label="Удалить вкладку"
                        borderRadius="full"
                      />
                    )}
                  </Tab>
                ))}

                <Tooltip
                  label={
                    isAddTabButtonDisabled
                      ? "Невозможно добавить вкладку"
                      : "Добавить вкладку задач"
                  }
                  placement="top"
                >
                  <Button
                    onClick={addTab}
                    ml={2}
                    size="sm"
                    variant="outline"
                    borderRadius="full"
                    colorScheme="blue"
                    isDisabled={isAddTabButtonDisabled}
                    _hover={{ bg: "#2A69AC" }}
                  >
                    <FaPlus />
                  </Button>
                </Tooltip>
              </TabList>

              <TabPanels>
                {categories.map((category, index) => (
                  <Category key={index} id={category.id} />
                ))}
              </TabPanels>
            </Tabs>
          </Container>
        </Flex>
      </Flex>
    </Box>
  );
}

export default App;
