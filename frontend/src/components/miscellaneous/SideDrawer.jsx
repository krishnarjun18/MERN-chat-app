import React from "react";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "../ChatLoading";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Input,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { getSender } from "../../config/Chatlogic";
import toast from "react-hot-toast";
const SideDrawer = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.error(error);
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
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.error(error);
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
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  return (
    <>
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: "none", md: "flex" }} px={"4"}>
              Search user
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"work sans"}>
          Chat-App
        </Text>
        <div>
          <Menu>
            <MenuButton p={1} position="relative">
              <BellIcon fontSize={"2xl"} margin={1} />
              {notifications.length > 0 && (
                <Badge
                  position="absolute"
                  top="0"
                  right="0"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  px={2}
                  fontSize="0.8em"
                >
                  {notifications.length}
                </Badge>
              )}
            </MenuButton>
            <MenuList pl={4}>
              {!notifications.length && "No New Messages"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifications(notifications.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                {/* <MenuItem>My profile</MenuItem> */}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottom={"1px"}>Search user</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
