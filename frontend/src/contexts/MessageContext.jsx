// src/contexts/MessageContext.jsx
import { createContext, useState } from "react";

export const MessageContext = createContext();

// eslint-disable-next-line react/prop-types
export const MessageProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);

  const addMessage = (message) => {
    setChatHistory((prevHistory) => [...prevHistory, message]);
  };

  // Function to update the last message in the chat history
  const updateLastMessage = (content) => {
    setChatHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;

      const lastMessage = prevHistory[prevHistory.length - 1];

      // Ensure the last message is from the assistant
      if (lastMessage.role !== "assistant") return prevHistory;

      const updatedMessage = {
        ...lastMessage,
        content: lastMessage.content + content,
      };

      return [...prevHistory.slice(0, -1), updatedMessage];
    });
  };

  return (
    <MessageContext.Provider
      value={{ chatHistory, addMessage, updateLastMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};
