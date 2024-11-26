import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  ChevronDown,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

interface FolderProps {
  name: string;
  chats: string[];
  isExpanded?: boolean;
}

export function Folder({
  name,
  chats,
  isExpanded: defaultExpanded = false,
}: FolderProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 p-2 w-full hover:bg-gray-700 rounded-lg text-sm"
      >
        <FolderOpen size={16} />
        <span className="flex-1 text-left">{name}</span>
        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-8"
          >
            {chats.map((chat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg cursor-pointer text-sm"
              >
                <MessageCircle size={14} />
                <span>{chat}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
