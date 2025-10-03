import React, { useState } from "react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../context/ChatProvider";
import { useToast, Box, Stack, Text, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../config/Chatlogic";
import GroupChatModal from "./miscellaneous/GroupChatModal";
const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  const fetchChats = async () => {
    if (!user?.token) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Fetch chats error:", error.response || error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      className="parent"
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            size="sm"
            ml={2}
            rightIcon={<AddIcon />}
            onClick={() => console.log("Open group modal")}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        className="child"
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" maxH="400px">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
