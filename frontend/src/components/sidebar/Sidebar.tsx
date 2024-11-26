import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  FolderOpen,
  PlusCircle,
  Settings,
  Menu,
  ChevronLeft,
  MoreHorizontal,
  Expand,
} from "lucide-react";
import { QuickAccess } from "./QuickAccess";
import { RecentChats } from "./RecentChats";
import { Folder } from "./Folder";
import { FileExplorerView } from "../file-explorer/FileExplorerView";
import { folders, recentChats } from "../data/sidebarData";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("Recent");

  const sidebarVariants = {
    open: {
      width: isFileExplorerOpen ? "650px" : isExpanded ? "288px" : "72px",
      transition: { duration: 0.3 },
    },
    closed: {
      width: "0px",
      transition: { duration: 0.3 },
    },
  };

  const DefaultView = () => (
    <div
      className="h-full flex flex-col"
      style={{ width: isExpanded ? "288px" : "72px" }}
    >
      <div className="p-4 pb-0 flex items-center justify-between">
        {isExpanded ? (
          <>
            <h1 className="text-xl font-semibold text-sidebar-text-primary">
              {/* Opus0 */}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFileExplorerOpen(true)}
                className="p-1 hover:bg-sidebar-hover rounded"
              >
                <Expand size={16} className="text-sidebar-text-secondary" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="lg:flex hidden text-sidebar-text-secondary"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full flex justify-center text-sidebar-text-secondary"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {isExpanded ? (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <button className="w-full flex items-center gap-2 text-sidebar-accent-primary hover:bg-sidebar-hover rounded-lg p-2">
              <PlusCircle size={18} />
              <span>Start new chat</span>
            </button>
          </div>

          <div className="px-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2 px-2 text-sidebar-text-secondary">
                Quick Access
              </h3>
              <QuickAccess />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 px-2 text-sidebar-text-secondary">
                Folders
              </h3>
              <div className="space-y-1">
                {folders.map((folder, i) => (
                  <Folder key={i} {...folder} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 px-2 text-sidebar-text-secondary">
                Recent
              </h3>
              <RecentChats chats={recentChats} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 py-4">
          <div className="mb-4 flex justify-center">
            <button className="p-2 text-sidebar-accent-primary hover:bg-sidebar-hover rounded-lg">
              <PlusCircle size={20} />
            </button>
          </div>
          <QuickAccess isMinimized />
        </div>
      )}

      <div className="p-4 border-t border-sidebar-border">
        {isExpanded ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sidebar-accent-purple rounded-full flex items-center justify-center text-sidebar-text-primary">
                G
              </div>
              <span className="text-sm text-sidebar-text-secondary">
                user@example.com
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-sidebar-hover rounded text-sidebar-text-secondary">
                <Settings size={16} />
              </button>
              <button className="p-1 hover:bg-sidebar-hover rounded text-sidebar-text-secondary">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button className="w-full flex justify-center">
            <div className="w-8 h-8 bg-sidebar-accent-purple rounded-full flex items-center justify-center text-sidebar-text-primary">
              G
            </div>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black lg:hidden"
            onClick={onClose}
          />
          <motion.div
            className={`fixed lg:relative left-0 top-0 h-screen bg-sidebar-bg text-sidebar-text-secondary overflow-hidden z-10 ${
              isFileExplorerOpen ? "shadow-2xl" : ""
            }`}
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            {isFileExplorerOpen ? (
              <FileExplorerView
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
                onClose={() => setIsFileExplorerOpen(false)}
              />
            ) : (
              <DefaultView />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
