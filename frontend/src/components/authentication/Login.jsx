import { VStack } from "@chakra-ui/react";
import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Registration successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <VStack spacing={"5px"} color={"black"}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              type={show ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.5rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
        >
          Log in
        </Button>

        <Button
          variant={"solid"}
          colorScheme="red"
          width="100%"
          isLoading={loading}
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Log in as guest user
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
