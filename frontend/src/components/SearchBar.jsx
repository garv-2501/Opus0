import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useInputHandling } from "../hooks/useInputHandling.jsx";
import CommandSuggestion from "./CommandSuggestion";
import commands from "../commands"; // Ensure the commands file is imported

const SearchBar = ({ onSendMessage, setInput, setCommand }) => {
  const { query, handleInputChange, clearCommand, finalizedCommandRef } =
    useInputHandling(setInput, setCommand);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const textareaRef = useRef(null);
  const caretPositionRef = useRef({ start: 0, end: 0 }); // To track caret position

  useEffect(() => {
    const textareaElement = textareaRef.current;
    if (textareaElement) {
      textareaElement.focus();
    }
  }, [query]);

  useEffect(() => {
    const textareaElement = textareaRef.current;
    if (textareaElement) {
      // Dynamically adjust height
      textareaElement.style.height = "auto";
      const maxHeight =
        parseInt(window.getComputedStyle(textareaElement).lineHeight) * 10;
      textareaElement.style.maxHeight = `${maxHeight}px`;
      textareaElement.style.overflowY =
        textareaElement.scrollHeight > maxHeight ? "scroll" : "hidden";
      textareaElement.style.height = `${Math.min(
        textareaElement.scrollHeight,
        maxHeight
      )}px`;
    }

    setIsButtonEnabled(query.trim().length > 0);
  }, [query]);

  const saveCaretPosition = () => {
    if (textareaRef.current) {
      caretPositionRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      };
    }
  };

  const restoreCaretPosition = () => {
    if (textareaRef.current && caretPositionRef.current) {
      textareaRef.current.setSelectionRange(
        caretPositionRef.current.start,
        caretPositionRef.current.end
      );
    }
  };

  const handleInputChangeWithSuggestion = (e) => {
    saveCaretPosition(); // Save caret position before updating
    const inputValue = e.target.value;
    handleInputChange(e);

    const potentialCommand = inputValue.split(" ")[0];
    if (inputValue.startsWith("/")) {
      setShowSuggestion(true);
    } else {
      setShowSuggestion(false);
    }

    if (inputValue.includes(" ") && !commands[potentialCommand]) {
      setShowSuggestion(false);
    }

    // Restore caret position after updating
    setTimeout(() => restoreCaretPosition(), 0);
  };

  const handleKeyDown = (e) => {
    const commandLength = 1;
    const inputValue = textareaRef.current.value;
    const cursorPosition = textareaRef.current.selectionStart;
    const isCursorAtEnd = cursorPosition === inputValue.length;

    const isArrowKey = e.key === "ArrowLeft" || e.key === "ArrowRight";
    const isCtrlArrowKey =
      (e.ctrlKey || e.metaKey) &&
      (e.key === "ArrowLeft" || e.key === "ArrowRight");
    const isCtrlA = (e.ctrlKey || e.metaKey) && e.key === "a";

    // Skip caret saving/restoring for arrow keys and Ctrl+A
    if (isArrowKey || isCtrlArrowKey || isCtrlA) {
      return;
    }

    saveCaretPosition(); // Save caret before handling key down

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      return;
    }

    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      textareaRef.current.selectionStart === 0 &&
      textareaRef.current.selectionEnd === query.length
    ) {
      clearCommand();
      return;
    }

    if (
      e.key === "Backspace" &&
      e.ctrlKey &&
      !query.slice(commandLength).trim()
    ) {
      clearCommand();
      return;
    }

    if (e.key === "Backspace" && e.shiftKey) {
      const lastSpaceIndex = inputValue.lastIndexOf(" ", cursorPosition - 1);
      const wordToDelete = inputValue.slice(lastSpaceIndex + 1, cursorPosition);

      if (
        isCursorAtEnd &&
        wordToDelete.length === cursorPosition - lastSpaceIndex - 1
      ) {
        handleInputChange(e);

        if (!query.slice(commandLength).trim()) {
          clearCommand();
        }
        return;
      }
    }

    if (
      (e.key === "Backspace" ||
        e.key === "Delete" ||
        (e.key === "Backspace" && e.ctrlKey)) &&
      !query.slice(commandLength).trim()
    ) {
      clearCommand();
    } else {
      handleInputChangeWithSuggestion(e);
    }

    // Restore caret position after key handling
    setTimeout(() => restoreCaretPosition(), 0);
  };

  const handleCommandSelect = (command) => {
    handleInputChange({
      target: { value: command + " " },
    });
    setShowSuggestion(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSendMessage = () => {
    if (isButtonEnabled || query.trim().length > 0) {
      onSendMessage({
        command: finalizedCommandRef.current,
        query,
        attachedFile,
      });
    }
    clearCommand();
    setAttachedFile(null);
    setIsButtonEnabled(false);
  };

  return (
    <div
      className=" search-bar relative flex justify-center items-start p-2 pt-0 mx-auto bg-main-area-color"
      style={{ marginTop: "4px", width: "100%" }} // Ensure full width and top margin
    >
      {showSuggestion && (
        <CommandSuggestion
          input={query}
          handleCommandSelect={handleCommandSelect}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}
      <div className="relative flex items-start p-2 bg-search-bar-color rounded-[32px] md:w-[70vw] w-[90vw] max-w-[800px]">
        <label
          htmlFor="file-upload"
          className="cursor-pointer p-3 mr-1 rounded-full bg-search-bar-button-color flex-shrink-0"
          style={{
            alignSelf: "flex-end",
          }}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-text-color"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </label>

        <div className="flex-grow flex flex-col justify-center mx-2">
          <div className="flex items-center">
            {finalizedCommandRef.current && (
              <span className="bg-yellow-200 text-gray-800 px-2 py-1 rounded-lg mb-2">
                /{finalizedCommandRef.current}
              </span>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleInputChangeWithSuggestion}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none text-text-color resize-none overflow-hidden w-full"
            placeholder="Search..."
            style={{
              caretColor: "auto",
              minHeight: "40px",
              lineHeight: "1.5",
              paddingTop: "10px",
              paddingBottom: "10px",
              maxHeight: "150px",
              overflowY: "auto",
            }}
            rows={1}
          />
        </div>

        <button
          onClick={handleSendMessage}
          className={`p-3 ml-1 rounded-full flex-shrink-0  ${
            isButtonEnabled
              ? "bg-white text-black cursor-pointer"
              : "bg-search-bar-button-color text-[#858585] cursor-default"
          }`}
          disabled={!isButtonEnabled}
          style={{
            alignSelf: "flex-end",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-7-7l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  setInput: PropTypes.func.isRequired,
  setCommand: PropTypes.func.isRequired,
};

export default SearchBar;
