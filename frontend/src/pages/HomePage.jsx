/* eslint-disable no-unused-vars */
// HomePage.jsx
import ChatArea from "../components/ChatArea";
import SearchBar from "../components/SearchBar";
import useMessageHandling from "../hooks/useMessageHandling";
import Header from "../components/Header";

const HomePage = () => {
  const { input, setInput, handleSendMessage, isConnected } =
    useMessageHandling();

  return (
    <div className="flex flex-col h-screen bg-main-area-color text-white overflow-hidden">
      {/* Header */}
      <Header className="w-full z-20 transition-all duration-300" />

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
  );
};

export default HomePage;
