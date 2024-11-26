import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Settings2, Share2, Pencil } from "lucide-react";
import { ChatSettingsItem } from "./ChatSettingsItem";
import { chatSettings } from "./ChatSettingsConfig";

interface HeaderProps {
  chatTitle: string;
  onChatTitleChange: (title: string) => void;
}

const models = [
  { name: "opus0", description: "Fast and efficient for most tasks" },
  { name: "opus0-pro", description: "Advanced capabilities for complex tasks" },
  {
    name: "opus0-ultra",
    description: "Maximum performance for specialized needs",
  },
];

const MAX_TITLE_LENGTH = 100;

export function Header({ chatTitle, onChatTitleChange }: HeaderProps) {
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(chatTitle);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedTitle(chatTitle);
  }, [chatTitle]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modelSelectorRef.current &&
        !modelSelectorRef.current.contains(event.target as Node)
      ) {
        setIsModelSelectorOpen(false);
      }
      if (
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditStart = () => {
    setIsEditing(true);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    });
  };

  const handleEditComplete = () => {
    if (editedTitle.trim()) {
      onChatTitleChange(editedTitle.slice(0, MAX_TITLE_LENGTH));
    } else {
      setEditedTitle(chatTitle);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditComplete();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(chatTitle);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_TITLE_LENGTH) {
      setEditedTitle(newValue);
    }
  };

  return (
    <header className="h-14 px-4 flex items-center justify-between bg-[#070909] relative z-50">
      <div className="relative" ref={modelSelectorRef}>
        <button
          onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-gray-300 hover:bg-[#1C2024] rounded-md transition-colors duration-150"
        >
          <span className="font-bold tracking-tight text-xl">
            {selectedModel.name}
          </span>
          <ChevronDown
            size={14}
            className={`transform transition-transform duration-150 ${
              isModelSelectorOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isModelSelectorOpen && (
            <motion.div
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute top-full left-0 mt-1 w-64 bg-[#1C2024] rounded-lg shadow-lg border border-[#2C3238]"
            >
              {models.map((model, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedModel(model);
                    setIsModelSelectorOpen(false);
                  }}
                  className="w-full flex flex-col items-start p-2.5 text-left hover:bg-[#2C3238] transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                >
                  <span className="text-gray-200 font-medium text-sm">
                    {model.name}
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {model.description}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 max-w-[500px] mx-4">
        <div className="flex items-center justify-center relative group">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-center"
            >
              <input
                ref={inputRef}
                type="text"
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleEditComplete}
                onKeyDown={handleKeyDown}
                className="w-[300px] text-lg text-gray-200 text-center py-1 bg-transparent outline-none placeholder-gray-500"
                maxLength={MAX_TITLE_LENGTH}
                placeholder="Enter chat title"
              />
            </motion.div>
          ) : (
            <motion.div
              onClick={handleEditStart}
              className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer group"
              whileTap={{ scale: 0.98 }}
            >
              <span
                className="text-sm text-gray-300 group-hover:text-gray-200 truncate max-w-[300px] transition-colors duration-150 "
                title={chatTitle}
              >
                {chatTitle}
              </span>
              <Pencil
                size={12}
                className="text-gray-500 group-hover:text-gray-400 transition-colors duration-150 flex-shrink-0"
              />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button className="p-2 text-gray-400 hover:text-gray-300 rounded-md transition-colors duration-150">
          <Share2 size={20} />
        </button>

        <div className="relative" ref={settingsButtonRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 text-gray-400 hover:text-gray-300 rounded-md transition-colors duration-150"
          >
            <Settings2 size={20} />
          </button>

          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute top-full right-0 mt-1 w-80 bg-[#1C2024] rounded-lg shadow-lg border border-[#2C3238]"
                style={{ maxHeight: "calc(100vh - 80px)" }}
              >
                <div className="max-h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
                  {chatSettings.map((setting, index) => (
                    <ChatSettingsItem
                      key={index}
                      icon={setting.icon}
                      title={setting.title}
                      description={setting.description}
                      iconColor={setting.iconColor}
                      options={setting.options}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
