import { useState } from "react";

import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { useDispatch } from "react-redux";

import { createCategory } from "../api/api";
import { ADD_CATEGORY } from "../store/actions";

const AddTabModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const [newTabName, setNewTabName] = useState("");

  const handleAddTab = () => {
    createCategory(newTabName).then((response) =>
      dispatch({ type: ADD_CATEGORY, payload: response.data })
    );
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Добавить новую вкладку</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <Input
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="Введите название новой вкладки"
              autoFocus
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAddTab}>
            Добавить
          </Button>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Закрыть
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTabModal;
