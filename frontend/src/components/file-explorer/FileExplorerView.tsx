import React, { useState } from "react";
import { Search, ChevronLeft, FolderOpen, Edit2, Trash2 } from "lucide-react";
import { QuickAccess } from "../sidebar/QuickAccess";
import { FileItem } from "./FileItem";
import { folders, recentChats } from "../data/sidebarData";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../ui/Button";
import { Heading } from "../ui/Heading";
import { SubHeading } from "../ui/SubHeading";

interface FileExplorerViewProps {
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  onClose: () => void;
}

export function FileExplorerView({
  selectedFolder,
  setSelectedFolder,
  onClose,
}: FileExplorerViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [localFolders, setLocalFolders] = useState(folders);
  const [localRecentChats, setLocalRecentChats] = useState(recentChats);

  const handleDrop = (folderId: string, item: { id: string; name: string }) => {
    const updatedFolders = localFolders.map((folder) => ({
      ...folder,
      chats: folder.chats.filter((chat) => chat !== item.name),
    }));

    const targetFolder = updatedFolders.find((f) => f.name === folderId);
    if (targetFolder && !targetFolder.chats.includes(item.name)) {
      targetFolder.chats.push(item.name);
    }

    setLocalFolders(updatedFolders);
    setLocalRecentChats(localRecentChats.filter((chat) => chat !== item.name));
  };

  const getCurrentContent = () => {
    if (selectedFolder === "Recent") return localRecentChats;
    const folder = localFolders.find((f) => f.name === selectedFolder);
    return folder ? folder.chats : [];
  };

  const handleEditFile = (id: string) => {
    console.log("Edit file:", id);
  };

  const handleDeleteFile = (id: string) => {
    if (selectedFolder === "Recent") {
      setLocalRecentChats(localRecentChats.filter((chat) => chat !== id));
    } else {
      setLocalFolders(
        localFolders.map((folder) => {
          if (folder.name === selectedFolder) {
            return {
              ...folder,
              chats: folder.chats.filter((chat) => chat !== id),
            };
          }
          return folder;
        })
      );
    }
  };

  const handleEditFolder = () => {
    console.log("Edit folder:", selectedFolder);
  };

  const handleDeleteFolder = () => {
    if (selectedFolder !== "Recent") {
      setLocalFolders(
        localFolders.filter((folder) => folder.name !== selectedFolder)
      );
      setSelectedFolder("Recent");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col bg-sidebar-bg">
        <div className="p-4 pb-2 flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-sidebar-text-secondary hover:text-sidebar-text-primary"
          >
            <ChevronLeft size={18} />
          </button>
          {/* <Heading>opus0</Heading> */}
        </div>

        <div className="p-3 border-b border-sidebar-border">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-sidebar-text-secondary"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files and folders..."
              className="w-full bg-sidebar-hover rounded-lg pl-9 pr-3 py-2.5 text-sm text-sidebar-text-primary placeholder-sidebar-text-secondary focus:outline-none focus:ring-2 focus:ring-sidebar-accent-primary"
            />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-56 border-r border-sidebar-border overflow-y-auto">
            <div className="p-3 space-y-5">
              <div>
                <SubHeading className="mb-2 px-2">Quick Access</SubHeading>
                <QuickAccess
                  isFileExplorer
                  onSelect={setSelectedFolder}
                  selectedFolder={selectedFolder}
                  onDrop={handleDrop}
                />
              </div>

              <div>
                <SubHeading className="mb-2 px-2">Folders</SubHeading>
                <div className="space-y-0.5">
                  {localFolders.map((folder, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sidebar-text-primary ${
                        selectedFolder === folder.name
                          ? "bg-sidebar-hover"
                          : "hover:bg-sidebar-hover"
                      }`}
                      onClick={() => setSelectedFolder(folder.name)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const item = JSON.parse(
                          e.dataTransfer.getData("application/json")
                        );
                        handleDrop(folder.name, item);
                      }}
                    >
                      <FolderOpen
                        size={14}
                        className="text-sidebar-accent-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{folder.name}</span>
                          <span className="text-xs text-sidebar-text-secondary">
                            {folder.chats.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <Heading>{selectedFolder}</Heading>
                  <p className="text-xs text-sidebar-text-secondary mt-0.5">
                    {getCurrentContent().length} items
                  </p>
                </div>
                {selectedFolder !== "Recent" && (
                  <div className="flex items-center gap-1">
                    <Button onClick={handleEditFolder} icon={Edit2} />
                    <Button onClick={handleDeleteFolder} icon={Trash2} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {getCurrentContent().map((item, i) => (
                  <FileItem
                    key={i}
                    id={item}
                    name={item}
                    onEdit={handleEditFile}
                    onDelete={handleDeleteFile}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
