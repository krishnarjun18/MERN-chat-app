import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App.jsx";
import ChatProvider from "./context/ChatProvider.jsx";
const theme = extendTheme({});

createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>
);
