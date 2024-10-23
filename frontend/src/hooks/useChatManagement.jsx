import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const useChatManagement = () => {
  const [currentChatHistory, setCurrentChatHistory] = useState([]);
  const [chatHistoriesLog, setChatHistoriesLog] = useState({});
  const [currentChatId, setCurrentChatId] = useState(uuidv4());
  const pendingRequestsRef = useRef({});

  // Initialize the first chat when the component mounts
  useEffect(() => {
    const initialChatId = uuidv4();
    setChatHistoriesLog({
      [initialChatId]: {
        id: initialChatId,
        name: "Chat 1",
        history: [],
      },
    });
    setCurrentChatId(initialChatId);
  }, []);

  const handleNewChat = () => {
    const newChatId = uuidv4();
    const newChatNumber = Object.keys(chatHistoriesLog).length + 1;

    // Save the current chat history to the log
    setChatHistoriesLog((prevLog) => ({
      ...prevLog,
      [currentChatId]: {
        id: currentChatId,
        name: prevLog[currentChatId]?.name || `Chat ${newChatNumber}`,
        history: currentChatHistory,
      },
      [newChatId]: {
        id: newChatId,
        name: `Chat ${newChatNumber}`,
        history: [],
      },
    }));

    // Reset current chat history
    setCurrentChatHistory([]);
    setCurrentChatId(newChatId);
  };

  const handleLoadChatHistory = (chatId) => {
    // Save the current chat history to the log
    setChatHistoriesLog((prevLog) => ({
      ...prevLog,
      [currentChatId]: {
        id: currentChatId,
        name:
          prevLog[currentChatId]?.name ||
          `Chat ${Object.keys(prevLog).length + 1}`,
        history: currentChatHistory,
      },
    }));
    // Load the selected chat history
    setCurrentChatHistory(chatHistoriesLog[chatId]?.history || []);
    setCurrentChatId(chatId);
  };

  const addMessageToCurrentChat = (message) => {
    setCurrentChatHistory((prevHistory) => [...prevHistory, message]);
  };

  return {
    currentChatHistory,
    chatHistoriesLog,
    currentChatId,
    setCurrentChatHistory,
    setChatHistoriesLog,
    setCurrentChatId,
    handleNewChat,
    handleLoadChatHistory,
    addMessageToCurrentChat,
    pendingRequestsRef,
  };
};

export default useChatManagement;
