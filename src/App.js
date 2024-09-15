import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaCog, FaPlus, FaTasks, FaTrash, FaFileExport } from "react-icons/fa";

import AddTabModal from "./screens/AddTabModal";
import Authorization from "./screens/Authorization";
import Category from "./screens/Category";
import Header from "./screens/Header";

import { getCategories, getMe, getTasks } from "./api/api";
import { SET_CATEGORIES, SET_USER } from "./store/actions";

import { useDispatch, useSelector } from "react-redux";
import TaskDetailsModal from "./screens/TaskDetailsModal";
import { DELETE_CATEGORY } from "./store/actions";
import { exportToJson } from "./utils/exportUtils";

function App() {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const { colorMode, toggleColorMode } = useColorMode();

  const [activeTab, setActiveTab] = useState(0);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAddTabButtonDisabled, setIsAddTabButtonDisabled] = useState(false);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [isAddTabModalOpen, setIsAddTabModalOpen] = useState(false); // Состояние для открытия и закрытия модального окна

  // Проверка, было ли уже показано окно регистрации
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
  }, []);

  const addTab = () => {
    if (categories.length >= 10) {
      setIsAddTabButtonDisabled(true);
      return;
    }
    setIsAddTabModalOpen(true); // Открываем модальное окно для добавления новой вкладки
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

  // Функция для экспорта всех заметок в JSON
  const handleExportNotes = () => {
    let tasks = []
    
    categories.forEach(x => getTasks(x.id).then(response => tasks.push(response.data)))

    console.log(tasks)

    const notes = categories.map((tab, i) => ({
      name: tab.name,
      tasks: tasks[i].map((task) => ({
        text: task.text,
        completed: task.completed,
        note: task.note,
      })),
    }));
    exportToJson(notes);
  };

  // const handleOpenTaskDetailsModal = (task) => {
  //   setSelectedTask(task);
  //   setIsTaskDetailsModalOpen(true);
  // };

  // const handleSaveTaskDetails = (updatedTask) => {
  //   const newTabs = [...tabs];
  //   const taskIndex = newTabs[activeTab].tasks.findIndex(
  //     (task) => task === selectedTask
  //   );
  //   if (taskIndex !== -1) {
  //     newTabs[activeTab].tasks[taskIndex] = updatedTask;
  //     setTabs(newTabs);
  //   }
  //   setIsTaskDetailsModalOpen(false);
  // };

  return (
    <Box>
      <Authorization
        isOpen={isRegistrationModalOpen}
        setIsOpen={setIsRegistrationModalOpen}
      />

      {/* <TaskDetailsModal
        isOpen={isTaskDetailsModalOpen}
        onClose={() => setIsTaskDetailsModalOpen(false)}
        task={selectedTask}
        onSave={handleSaveTaskDetails}
      /> */}
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
                    onClick={() => addTab()}
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
