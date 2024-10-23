import { useState, useRef } from "react";
import commands from "../commands"; // Ensure the commands file is imported

export const useInputHandling = (
  setInput, // Ensure this is passed correctly
  setCommand
) => {
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [query, setQuery] = useState("");
  const finalizedCommandRef = useRef("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Ensure setInput is a valid function
    if (typeof setInput === "function") {
      setInput(inputValue);
    } else {
      console.error("setInput is not a function");
    }

    if (!isCommandMode && inputValue.startsWith("/")) {
      setIsCommandMode(true);
      setQuery(inputValue);
    }

    if (isCommandMode) {
      const spaceIndex = inputValue.indexOf(" ");

      if (spaceIndex !== -1) {
        const command = inputValue.slice(1, spaceIndex);
        if (commands[`/${command}`]) {
          finalizedCommandRef.current = command;
          setIsCommandMode(false);
          setQuery("");
          setCommand(command);
        } else {
          setIsCommandMode(false);
          setQuery(inputValue);
        }
      } else {
        setQuery(inputValue);
      }
    } else {
      setQuery(inputValue);
      setInput(inputValue);
    }
  };

  const handleKeyDown = () => {
    // Additional handling logic
  };

  const clearCommand = () => {
    finalizedCommandRef.current = "";
    setIsCommandMode(false);
    setQuery(""); // Clear the input field
    setInput(""); // Also clear the input state
  };

  return {
    handleInputChange,
    handleKeyDown,
    clearCommand,
    finalizedCommandRef,
    isCommandMode, // Export isCommandMode in case it's needed elsewhere
    query, // Ensure query is returned and accessible
  };
};
