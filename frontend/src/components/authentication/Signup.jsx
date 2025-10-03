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

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);

    if (!pics) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app"); // must exist in Cloudinary
      data.append("cloud_name", "dth6iwepg"); // must match your Cloudinary cloud name

      fetch("https://api.cloudinary.com/v1_1/dth6iwepg/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.secure_url) {
            setPic(data.secure_url.toString());
            toast({
              title: "Image uploaded successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          } else {
            // Cloudinary returned an error object
            toast({
              title: "Upload failed",
              description:
                data.error?.message || "Something went wrong with Cloudinary",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            console.error("Cloudinary error:", data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Upload error:", err);
          toast({
            title: "Upload error",
            description: "Unable to upload image. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG or PNG image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
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
    if (password !== confirmpassword) {
      toast({
        title: "Passwords do nat match",
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
        "/api/user",
        { name, email, password, pic },
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
        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter your name"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Enter your password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.5rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirmpassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Confirm your password"
              autoComplete="new-password"
              type={show ? "text" : "password"}
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.5rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic">
          <FormLabel>Upload your picture</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign up
        </Button>
      </VStack>
    </form>
  );
};

export default Signup;
