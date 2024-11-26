import React, { useState } from "react";
import { MessageCircle, ChevronDown } from "lucide-react";

const INITIAL_CHATS_COUNT = 5;

interface RecentChatsProps {
  chats: string[];
}

export function RecentChats({ chats }: RecentChatsProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedChats = showAll ? chats : chats.slice(0, INITIAL_CHATS_COUNT);

  return (
    <div className="space-y-1">
      {displayedChats.map((chat, i) => (
        <div
          key={i}
          className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer text-sm"
        >
          <MessageCircle size={14} className="text-sidebar-text-secondary" />
          <span className="flex-1 truncate">{chat}</span>
        </div>
      ))}
      {chats.length > INITIAL_CHATS_COUNT && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 p-2 text-sm text-gray-400 hover:bg-gray-800 rounded-lg w-full"
        >
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              showAll ? "rotate-180" : ""
            }`}
          />
          <span>
            {showAll
              ? "Show Less"
              : `Show ${chats.length - INITIAL_CHATS_COUNT} More`}
          </span>
        </button>
      )}
    </div>
  );
}
