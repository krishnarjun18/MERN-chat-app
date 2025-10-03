import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/ChatProvider.jsx";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.error("Search user error:", error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };
  return (
    <div>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
