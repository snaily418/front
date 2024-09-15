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
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaSun, FaMoon, FaBars, FaTasks, FaCog } from 'react-icons/fa';

function App() {
  // Хук для управления темой (светлая/темная)
  const { colorMode, toggleColorMode } = useColorMode();

  // Состояние для хранения вкладок и задач
  const [tabs, setTabs] = useState([
    { name: 'Работа', tasks: [] },
    { name: 'Личное', tasks: [] },
  ]);

  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState(0);

  // Состояние для новой задачи
  const [newTask, setNewTask] = useState('');

  // Состояние для модального окна регистрации
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  // Состояние для имени пользователя и пароля
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Состояние для статуса входа
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Хук для управления открытием/закрытием боковой панели
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Хук для отображения уведомлений
  const toast = useToast();

  // Проверка, было ли уже показано окно регистрации
  useEffect(() => {
    const hasRegistered = localStorage.getItem('hasRegistered');
    if (!hasRegistered) {
      setIsRegistrationModalOpen(true);
    }
  }, []);

  // Функция для добавления новой вкладки
  const addTab = (backgroundColor, color) => {
    const newTabName = prompt('Введите название новой вкладки', '', {
      style: {
        backgroundColor: backgroundColor,
        color: color,
      },
    });
    if (newTabName) {
      setTabs([...tabs, { name: newTabName, tasks: [] }]);
    }
  };

  // Функция для удаления вкладки
  const deleteTab = (index) => {
    if (index < 2) return; // Не удаляем основные вкладки
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    if (activeTab === index) {
      setActiveTab(0);
    }
  };

  // Функция для добавления новой задачи
  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTabs = [...tabs];
      newTabs[activeTab].tasks.unshift({ text: newTask, completed: false });
      setTabs(newTabs);
      setNewTask('');
    }
  };

  // Функция для изменения текста задачи
  const handleTaskChange = (index, value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].tasks[index].text = value;
    setTabs(newTabs);
  };

  // Функция для отметки задачи как выполненной
  const handleTaskCompletion = (index) => {
    const newTabs = [...tabs];
    newTabs[activeTab].tasks[index].completed = !newTabs[activeTab].tasks[index].completed;
    newTabs[activeTab].tasks.sort((a, b) => a.completed - b.completed);
    setTabs(newTabs);

    // Проверка на выполнение 3 и более задач
    const completedTasks = newTabs[activeTab].tasks.filter(task => task.completed);
    if (completedTasks.length >= 3) {
      toast({
        title: "Поздравляю!",
        description: `Ты выполнил все задачи и продолжил серию, которая длится уже ${completedTasks.length} дня!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Функция для обработки нажатия клавиши Enter
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  };

  // Функция для обработки регистрации
  const handleRegistration = () => {
    localStorage.setItem('hasRegistered', 'true');
    setIsRegistrationModalOpen(false);
  };

  // Функция для обработки входа
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsRegistrationModalOpen(false);
  };

  // Функция для обработки выхода
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Динамические цвета для модального окна в зависимости от темы
  const backgroundColor = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('black', 'white');

  return (
    <Box>
      {/* Модальное окно регистрации */}
      <Modal isOpen={isRegistrationModalOpen} onClose={() => setIsRegistrationModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Регистрация</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Имя пользователя</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите имя пользователя"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleRegistration}>
              Зарегистрироваться
            </Button>
            <Button variant="ghost" onClick={() => setIsRegistrationModalOpen(false)}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Основной контейнер с вертикальным расположением */}
      <Flex direction="column" h="100vh">
        {/* Верхняя панель навигации */}
        <Flex align="center" justify="space-between" p={4} bg={useColorModeValue('gray.100', 'gray.700')}>
          <IconButton icon={<FaBars />} onClick={onOpen} aria-label="Open Menu" />
          <Text fontSize="xl" fontWeight="bold">
            Snaily
          </Text>
          <Flex align="center">
            <Icon as={colorMode === 'light' ? FaSun : FaMoon} mr={2} />
            <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} size='lg'/>
          </Flex>
        </Flex>

        {/* Основной контент с боковой панелью и вкладками */}
        <Flex flex={1}>
          {/* Боковая панель */}
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Меню</DrawerHeader>
              <DrawerBody>
                <VStack align="start" spacing={4}>
                  <Link onClick={() => { setActiveTab(0); onClose(); }}>
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
              <DrawerFooter>
                <Divider />
                <Text mt={4}>&copy; 2024 Snaily</Text>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* Контейнер для вкладок и задач */}
          <Container maxW="container.md" centerContent flex={1} p={4}>
            <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
              {/* Список вкладок */}
              <TabList justifyContent="start" borderRadius="md">
                {tabs.map((tab, index) => (
                  <Tab 
                    key={index} 
                    _selected={{ color: mode('white', 'gray.800'), bg: 'teal.500' }}
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
                <Button 
                  onClick={() => addTab(backgroundColor, color)} 
                  ml={2} 
                  size="sm" 
                  variant="outline"
                  borderRadius="full"
                >
                  <FaPlus />
                </Button>
              </TabList>
              {/* Содержимое вкладок */}
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
                        </Box>
                      ))}
                    </Stack>
                    <Flex mt={4}>
                      <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Добавить задачу"
                      />
                      <Button onClick={addTask} ml={2} colorScheme="teal">
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