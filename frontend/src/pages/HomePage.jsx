// HomePage.jsx
import { useState } from "react";
import ChatArea from "../components/ChatArea";
import SearchBar from "../components/SearchBar";
import useMessageHandling from "../hooks/useMessageHandling";
import { Header } from "../components/header/Header"; // Import the new Header component
import { Sidebar } from "../components/sidebar/Sidebar"; // Import Sidebar
import { Menu } from "lucide-react"; // Import Menu icon

const HomePage = () => {
  const { input, setInput, handleSendMessage } = useMessageHandling();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility
  const [chatTitle, setChatTitle] = useState("New Chat"); // State for chat title
  const [currentModel, setCurrentModel] = useState(null); // State for the current model, initially null

  return (
    <div className="flex h-screen bg-main-area-color text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Toggle Sidebar Button (Visible on smaller screens) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed left-4 top-4 z-20 p-2 bg-gray-800 rounded-lg text-gray-300"
      >
        <Menu size={20} />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          currentChat={chatTitle}
          currentModel={currentModel}
          onTitleChange={(newTitle) => setChatTitle(newTitle)}
          onModelChange={(newModel) => setCurrentModel(newModel)}
          className="w-full z-20 transition-all duration-300"
        />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <ChatArea />
        </div>

        {/* Search Bar */}
        <div className="w-full px-2 pb-3">
          <SearchBar
            input={input}
            setInput={setInput}
            onSendMessage={handleSendMessage}
          />

          {/* Disclaimer Text Below the SearchBar */}
          <p className="text-xs text-gray-500 text-center pt-1">
            The assistant may produce inaccurate information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
