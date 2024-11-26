import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, List } from "lucide-react";
import { QuickAccess } from "./QuickAccess";
import { RecentChats } from "./RecentChats";
import { Folder } from "./Folder";
import { Heading } from "../ui/Heading";
import { SubHeading } from "../ui/SubHeading";

interface ExpandedSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Array<{ name: string; chats: string[] }>;
  recentChats: string[];
}

export function ExpandedSidebar({
  isOpen,
  onClose,
  folders,
  recentChats,
}: ExpandedSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-[650px] bg-sidebar-bg text-sidebar-text-secondary z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
                <Heading>File Browser</Heading>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-sidebar-hover rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-sidebar-text-secondary"
                  />
                  <input
                    type="text"
                    placeholder="Search chats and folders..."
                    className="w-full bg-sidebar-hover rounded-lg pl-9 pr-3 py-1.5 text-sm text-sidebar-text-primary placeholder-sidebar-text-secondary focus:outline-none focus:ring-2 focus:ring-sidebar-accent-primary"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div className="space-y-4">
                    <div className="bg-sidebar-hover rounded-lg p-4">
                      <SubHeading className="mb-3 flex items-center gap-2">
                        <List size={14} />
                        Quick Access
                      </SubHeading>
                      <QuickAccess />
                    </div>

                    <div className="bg-sidebar-hover rounded-lg p-4">
                      <SubHeading className="mb-3">Folders</SubHeading>
                      <div className="space-y-2">
                        {folders.map((folder, i) => (
                          <Folder key={i} {...folder} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-sidebar-hover rounded-lg p-4">
                    <SubHeading className="mb-3">Recent Chats</SubHeading>
                    <RecentChats chats={recentChats} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
