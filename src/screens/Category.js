import {
    Box,
    Button,
    Checkbox,
    Flex,
    IconButton,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Stack,
    TabPanel,
    Textarea
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";

import { useSelector } from "react-redux";
import { getTasks } from "../api/api";

const Category = ({ id }) => {
  const category = useSelector((state) =>
    state.categories.filter((x) => x.id == id)
  )[0];

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    getTasks(id).then((response) => setTasks(response.data));
  }, []);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setNewTask("");
    }
  };

  const handleTaskChange = (index, value) => {};

  const handleKeyPressTask = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  const handleNoteChange = (index, value) => {};

  const remainingTasksToReward =
    3 - tasks.filter((task) => task.completed).length;

  return (
    <TabPanel>
      <Stack spacing={2}>
        {tasks.map((task, taskIndex) => (
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
              onChange={() => {}}
              mb={2}
              pl="40px"
            >
              <Input
                value={task.text}
                onChange={(e) => handleTaskChange(taskIndex, e.target.value)}
                placeholder={`Задача ${taskIndex + 1}`}
                variant="unstyled"
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
                    onChange={(e) =>
                      handleNoteChange(taskIndex, e.target.value)
                    }
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
          placeholder={
            remainingTasksToReward > 0
              ? `Осталось еще ${remainingTasksToReward} задач`
              : "Введи задачу"
          }
        />
        <Button
          onClick={addTask}
          ml={2}
          colorScheme="blue"
          bg="#3884FD"
          _hover={{ bg: "#2A69AC" }}
        >
          Добавить
        </Button>
      </Flex>
    </TabPanel>
  );
};

export default Category;
