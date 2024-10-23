// src/hooks/useMessageHandling.jsx
import { useState, useEffect, useContext } from "react";
import { socket } from "../services/socket";
import { MessageContext } from "../contexts/MessageContext";

const useMessageHandling = () => {
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { addMessage, updateLastMessage } = useContext(MessageContext);

  useEffect(() => {
    // Event handlers
    const onConnect = () => {
      console.log("Connected to backend via Socket.IO");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("Disconnected from backend");
      setIsConnected(false);
    };

    const onChatResponse = (data) => {
      console.log("Received response from backend:", data);

      if (data === "[START]") {
        // Start of AI response
        addMessage({ role: "assistant", content: "" });
      } else if (data === "[END]") {
        // End of AI response
        console.log("AI response complete");
      } else {
        // Append chunk to the last AI message
        updateLastMessage(data);
      }
    };

    // Register event handlers
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat_response", onChatResponse);

    // Cleanup event handlers on unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat_response", onChatResponse);
    };
  }, [addMessage, updateLastMessage]);

  const handleSendMessage = () => {
    if (input.trim()) {
      console.log("Sending message to backend:", input);

      // Add user message to chat history
      addMessage({ role: "user", content: input });

      socket.emit("chat_message", input);
      setInput(""); // Clear the input field
    }
  };

  return {
    input,
    setInput,
    isConnected,
    handleSendMessage,
  };
};

export default useMessageHandling;
