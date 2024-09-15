import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaSun, FaMoon, FaBars, FaTasks, FaCog, FaCoins, FaComment } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';

import Authorization from "./screens/Authorization"

// Импортируем шрифт Roboto
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [tabs, setTabs] = useState([
    { name: 'Работа', tasks: [] },
    { name: 'Личное', tasks: [] },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [newTask, setNewTask] = useState('');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coins, setCoins] = useState(0); // Состояние для хранения количества монет
  const [lastRewardDateWork, setLastRewardDateWork] = useState(null); // Состояние для хранения даты последней награды для папки "Работа"
  const [lastRewardDatePersonal, setLastRewardDatePersonal] = useState(null); // Состояние для хранения даты последней награды для папки "Личное"
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isAddTabButtonDisabled, setIsAddTabButtonDisabled] = useState(false);
  const [isAddTabModalOpen, setIsAddTabModalOpen] = useState(false);
  const [newTabName, setNewTabName] = useState('');

  // Проверка, было ли уже показано окно регистрации
  useEffect(() => {
    const hasRegistered = localStorage.getItem('hasRegistered');
    if (!hasRegistered) {
      setIsRegistrationModalOpen(true);
    }
  }, []);

  const addTab = () => {
    if (tabs.length >= 10) {
      setIsAddTabButtonDisabled(true);
      return;
    }
    setIsAddTabModalOpen(true);
  };

  const handleAddTab = () => {
    if (newTabName.trim() !== '') {
      setTabs([...tabs, { name: newTabName, tasks: [] }]);
      if (tabs.length >= 9) {
        setIsAddTabButtonDisabled(true);
      }
      setNewTabName('');
      setIsAddTabModalOpen(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && newTabName.trim() !== '') {
      handleAddTab();
    }
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
    if (newTask.trim() !== '') {
      const newTabs = [...tabs];
      newTabs[activeTab].tasks.unshift({ text: newTask, completed: false, note: '' });
      setTabs(newTabs);
      setNewTask('');
    }
  };

  const handleTaskChange = (index, value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].tasks[index].text = value;
    setTabs(newTabs);
  };

  const handleTaskCompletion = (index) => {
    const newTabs = [...tabs];
    newTabs[activeTab].tasks[index].completed = !newTabs[activeTab].tasks[index].completed;
    newTabs[activeTab].tasks.sort((a, b) => a.completed - b.completed);
    setTabs(newTabs);

    const completedTasks = newTabs[activeTab].tasks.filter(task => task.completed);
    const today = new Date().toDateString();

    if (activeTab === 0) { // Работа
      if (completedTasks.length === 3 && (!lastRewardDateWork || lastRewardDateWork !== today)) {
        toast({
          title: "Поздравляю!",
          description: `Ты выполнил 3 задачи в папке "Работа" и получил 10 монет!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setCoins(coins + 10); // Начисляем 10 монет за закрытие 3 заданий
        setLastRewardDateWork(today); // Обновляем дату последней награды для папки "Работа"
      }
    } else if (activeTab === 1) { // Личное
      if (completedTasks.length === 3 && (!lastRewardDatePersonal || lastRewardDatePersonal !== today)) {
        toast({
          title: "Поздравляю!",
          description: `Ты выполнил 3 задачи в папке "Личное" и получил 10 монет!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setCoins(coins + 10); // Начисляем 10 монет за закрытие 3 заданий
        setLastRewardDatePersonal(today); // Обновляем дату последней награды для папки "Личное"
      }
    }
  };

  const handleKeyPressTask = (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  };

  const handleRegistration = () => {
    localStorage.setItem('hasRegistered', 'true');
    setIsRegistrationModalOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsRegistrationModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleNoteChange = (index, value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].tasks[index].note = value;
    setTabs(newTabs);
  };

  const backgroundColor = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('black', 'white');

  return (
    <Box fontFamily="Roboto, sans-serif">
      <Authorization isOpen={isRegistrationModalOpen} setIsOpen={setIsRegistrationModalOpen} />

      <Modal isOpen={isAddTabModalOpen} onClose={() => setIsAddTabModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавить новую вкладку</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите название новой вкладки"
                autoFocus
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddTab}>
              Добавить
            </Button>
            <Button variant="ghost" onClick={() => setIsAddTabModalOpen(false)}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex direction="column" h="100vh">
        <Flex align="center" justify="space-between" p={4} bg={useColorModeValue('gray.100', 'gray.700')}>
          <IconButton icon={<FaBars />} onClick={onOpen} aria-label="Open Menu" />
          <Text fontSize="3xl" fontWeight="bold">
            Snaily
          </Text>
          <Flex align="center">
            <HStack spacing={2} mr={4}>
              <Icon as={FaCoins} />
              <Text>{coins}</Text>
            </HStack>
            <Icon as={colorMode === 'light' ? FaSun : FaMoon} mr={2} boxSize={6} />
            <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} size='lg' colorScheme="blue" />
          </Flex>
        </Flex>

        <Flex flex={1}>
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Меню</DrawerHeader>
              <DrawerBody>
                <VStack align="start" spacing={4}>
                  <Link onClick={() => { setActiveTab(0); onClose(); }}>
                    <HStack>
                      <Icon as={FaTasks} boxSize={6} />
                      <Text fontSize="lg">Задания</Text>
                    </HStack>
                  </Link>
                  <Link onClick={() => setIsRegistrationModalOpen(true)}>
                    <HStack>
                      <Icon as={FaCog} boxSize={6} />
                      <Text fontSize="lg">Настройки</Text>
                    </HStack>
                  </Link>
                </VStack>
              </DrawerBody>
                <div align="center">
                  <Divider />
                  <Text align="center" mb={5} mt={4}>&copy; 2024 Snaily</Text>
                
                </div>
            </DrawerContent>
          </Drawer>

          <Container maxW="container.md" centerContent flex={1} p={4}>
            <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
              <TabList justifyContent="start" borderRadius="md">
                {tabs.map((tab, index) => (
                  <Tab 
                    key={index} 
                    _selected={{ color: 'white', bg: '#3884FD' }}
                    borderRadius="full"
                  >
                    {tab.name}
                    {index >= 2 && (
                      <IconButton
                        icon={<FaTrash />}
                        size="xs"
                        ml={2}
                        onClick={() => deleteTab(index)}
                        aria-label="Удалить вкладку"
                        borderRadius="full"
                      />
                    )}
                  </Tab>
                ))}
                <Tooltip
                  label={isAddTabButtonDisabled ? "Невозможно добавить вкладку" : "Добавить вкладку задач"}
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
                {tabs.map((tab, index) => (
                  <TabPanel key={index}>
                    <Stack spacing={2}>
                      {tab.tasks.map((task, taskIndex) => (
                        <Box key={taskIndex} position="relative">
                          <Box
                            position="absolute"
                            top="50%"
                            left="10px"
                            transform="translateY(-50%)"
                            fontSize="xl"
                            fontWeight="bold"
                            color="gray.400"
                            zIndex="-1"
                          >
                            {taskIndex + 1}
                          </Box>
                          <Checkbox
                            colorScheme="teal"
                            isChecked={task.completed}
                            onChange={() => handleTaskCompletion(taskIndex)}
                            mb={2}
                            pl="40px"
                            isDisabled={task.completed}
                          >
                            <Input
                              value={task.text}
                              onChange={(e) => handleTaskChange(taskIndex, e.target.value)}
                              placeholder={`Задача ${taskIndex + 1}`}
                              variant="unstyled"
                              isDisabled={task.completed}
                            /> 
                          
                          </Checkbox>
                          <Popover>
                            <PopoverTrigger>
                              <IconButton
                                icon={<BiEdit />} // добавялем примечания к задачам компонент popover
                                size="sm"
                                ml={2}
                                aria-label="Добавить примечание"
                                borderRadius="full"
                              />
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Примечание</PopoverHeader>
                              <PopoverBody>
                                <Textarea
                                  value={task.note}
                                  onChange={(e) => handleNoteChange(taskIndex, e.target.value)}
                                  placeholder="Добавьте примечание"
                                />
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </Box>
                      ))}
                    </Stack>
                    <Flex mt={4}>
                      <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPressTask}
                        placeholder="Добавить задачу"
                      />
                      <Button onClick={addTask} ml={2} colorScheme="blue" bg="#3884FD" _hover={{ bg: "#2A69AC" }}>
                        Добавить
                      </Button>
                    </Flex>
                  </TabPanel>
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