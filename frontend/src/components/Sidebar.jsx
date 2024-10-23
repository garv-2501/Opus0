/* eslint-disable react/prop-types */
import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion"; // Importing Framer Motion
import PropTypes from "prop-types";

// SVGs for icons provided by you
const PlusIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const HelpIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
    />
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const FolderIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
    />
  </svg>
);

const FavoriteIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
);

const RecentIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const ToggleCloseIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const ToggleOpenIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const Sidebar = ({
  handleNewChat,
  chatHistoriesLog,
  handleLoadChatHistory,
  currentChatId,
}) => {
  const [isOpen, setIsOpen] = useState(true); // State to track sidebar open/close
  const [showText, setShowText] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar state
  };

  // Delay the space and text creation for New Chat button
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 100); // Delay matches the New Chat button animation timing
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [isOpen]);

  // Define a common motion variant for all elements, including blur and fade-in
  const textVariants = {
    open: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.3, ease: "easeOut", delay: 0.3 }, // Unified delay and duration
    },
    closed: {
      opacity: 0,
      filter: "blur(10px)",
      transition: { duration: 0.2, ease: "easeIn" }, // No animation for closing
    },
  };

  return (
    <aside
      className={`bg-sidebar-color p-4 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-20"
      }`}
    >
      {/* Top Section: Menu toggle and New Chat */}
      <div>
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-text-color mb-12 p-2 rounded-full hover:bg-sidebar-button-color"
        >
          {isOpen ? (
            <ToggleCloseIcon className="w-8 h-8" />
          ) : (
            <ToggleOpenIcon className="w-8 h-8" />
          )}
        </button>

        {/* New Chat Button with unified animation */}
        <button
          onClick={handleNewChat}
          className={`text-text-color mb-6 p-2 ${
            isOpen ? (showText ? "px-4" : "px-2") : "ml-1"
          } rounded-full bg-sidebar-button-color hover:bg-sidebar-button-hover-color flex items-center gap-2 transition-all duration-200`}
        >
          <PlusIcon className="w-6 h-6" />
          {isOpen && showText && (
            <motion.span
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
              className="text-base"
            >
              New Chat
            </motion.span>
          )}
        </button>

        {/* Folders, Favorites, and Recents (Hidden in closed mode) */}
        {isOpen && (
          <>
            {/* Folders */}
            <div className="mb-4 ml-3">
              <motion.h2
                variants={textVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                className="text-base font-semibold text-text-color"
              >
                Folders
              </motion.h2>
              <ul>
                <motion.li
                  variants={textVariants}
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  className="text-text-color flex items-center gap-2 cursor-pointer hover:bg-sidebar-button-color my-2 py-1 pl-3 rounded-full"
                >
                  <FolderIcon className="w-5 h-5" />
                  <span className="text-text-color">Folder 1</span>
                </motion.li>
                <motion.li
                  variants={textVariants}
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  className="text-text-color flex items-center gap-2 cursor-pointer hover:bg-sidebar-button-color my-2 py-1 pl-3 rounded-full"
                >
                  <FolderIcon className="w-5 h-5" />
                  <span>Folder 2</span>
                </motion.li>
              </ul>
            </div>

            {/* Favorites */}
            <div className="mb-4 ml-3">
              <motion.h2
                variants={textVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                className="text-base font-semibold text-text-color"
              >
                Favorites
              </motion.h2>
              <ul>
                <motion.li
                  variants={textVariants}
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  className="text-text-color flex items-center gap-2 cursor-pointer hover:bg-sidebar-button-color my-2 py-1 pl-3 rounded-full"
                >
                  <FavoriteIcon className="w-5 h-5" />
                  <span>Favorite 1</span>
                </motion.li>
                <motion.li
                  variants={textVariants}
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  className="text-text-color flex items-center gap-2 cursor-pointer hover:bg-sidebar-button-color my-2 py-1 pl-3 rounded-full"
                >
                  <FavoriteIcon className="w-5 h-5" />
                  <span>Favorite 2</span>
                </motion.li>
              </ul>
            </div>

            {/* Recents (Chat Histories Log) */}
            <div className="flex-1 overflow-y-auto ml-3">
              <motion.h2
                variants={textVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                className="text-base font-semibold text-text-color mb-2"
              >
                Recents
              </motion.h2>
              <ul>
                {Object.values(chatHistoriesLog)
                  .reverse()
                  .map((chat) => (
                    <motion.li
                      key={chat.id}
                      variants={textVariants}
                      initial="closed"
                      animate={isOpen ? "open" : "closed"}
                      className={`text-text-color flex items-center gap-2 cursor-pointer hover:bg-sidebar-button-hover-color my-2 py-1 pl-3 rounded-full ${
                        chat.id === currentChatId
                          ? "bg-sidebar-button-color text-text-color"
                          : ""
                      }`}
                      onClick={() => handleLoadChatHistory(chat.id)}
                    >
                      <RecentIcon className="w-5 h-5" />
                      {chat.name}
                    </motion.li>
                  ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Bottom Section: Help and Settings (Always visible but only icons in closed mode) */}
      <div className="flex flex-col space-y-4 ml-1">
        <button
          className={`text-text-color p-2 rounded-full flex items-center ${
            isOpen ? "gap-2" : "justify-center"
          } hover:bg-sidebar-button-color`}
        >
          <HelpIcon className="w-6 h-6" />
          {isOpen && (
            <motion.span
              variants={textVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
            >
              Help
            </motion.span>
          )}
        </button>
        <button
          className={`text-text-color p-2 rounded-full flex items-center ${
            isOpen ? "gap-2" : "justify-center"
          } hover:bg-sidebar-button-color`}
        >
          <SettingsIcon className="w-6 h-6" />
          {isOpen && (
            <motion.span
              variants={textVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
            >
              Settings
            </motion.span>
          )}
        </button>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  handleNewChat: PropTypes.func.isRequired,
  chatHistoriesLog: PropTypes.object.isRequired,
  handleLoadChatHistory: PropTypes.func.isRequired,
  currentChatId: PropTypes.string.isRequired,
};

export default Sidebar;
