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
  FaFileExport,
} from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import useTaskNotification from "./hooks/useTaskNotification";
import Authorization from "./screens/Authorization";
import AddTabModal from "./screens/AddTabModal";
import Header from "./screens/Header";
import Category from "./screens/Category";

import { getMe, getCategories } from "./api/api";
import { SET_CATEGORIES, SET_USER } from "./store/actions";

import { useDispatch, useSelector } from "react-redux";
import { exportToJson } from "./utils/exportUtils"; // Импортируем функцию для экспорта
import { DELETE_CATEGORY } from "./store/actions";

function App() {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const { colorMode, toggleColorMode } = useColorMode();
  const [activeTab, setActiveTab] = useState(0);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isAddTabModalOpen, setIsAddTabModalOpen] = useState(false);
  const [isAddTabButtonDisabled, setIsAddTabButtonDisabled] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useTaskNotification(); // Используем хук для уведомлений

  useEffect(() => {
    const hasRegistered = localStorage.getItem("token");
    if (!hasRegistered) {
      setIsRegistrationModalOpen(true);
    } else {
      getMe()
        .then((response) => {
          dispatch({ type: SET_USER, payload: response.data });
        })
        .catch((error) => {});

      getCategories()
        .then((response) => {
          dispatch({ type: SET_CATEGORIES, payload: response.data });
        })
        .catch((error) => {});
    }
  }, [dispatch]);

  const addTab = () => {
    if (categories.length >= 10) {
      setIsAddTabButtonDisabled(true);
      return;
    }
    setIsAddTabModalOpen(true);
  };

  const deleteTab = (index) => {
    if (index < 2) return;
    dispatch({ type: DELETE_CATEGORY, payload: categories[index].id });

    if (activeTab === index) {
      setActiveTab(0);
    }
    if (categories.length < 10) {
      setIsAddTabButtonDisabled(false);
    }
  };

  const handleExportNotes = () => {
    const notes = categories.map((tab) => ({
      name: tab.name,
      tasks: tab.tasks.map((task) => ({
        text: task.text,
        completed: task.completed,
        note: task.note,
      })),
    }));
    exportToJson(notes);
  };

  return (
    <Box>
      <Authorization
        isOpen={isRegistrationModalOpen}
        setIsOpen={setIsRegistrationModalOpen}
      />

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
                  <Link onClick={handleExportNotes}>
                    <HStack>
                      <Icon as={FaFileExport} />
                      <Text>Экспорт в JSON</Text>
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
              <TabList
                categories={categories}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                deleteTab={deleteTab}
                addTab={addTab}
                isAddTabButtonDisabled={isAddTabButtonDisabled}
              />

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
