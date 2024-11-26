import React from "react";
import { useDrop } from "react-dnd";
import { FolderOpen } from "lucide-react";

interface FolderItemProps {
  folder: { name: string; chats: string[] };
  isSelected: boolean;
  onClick: () => void;
  onDrop: (item: { id: string; type: string }) => void;
}

export function FolderItem({
  folder,
  isSelected,
  onClick,
  onDrop,
}: FolderItemProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FILE",
    drop: (item: { id: string; type: string }) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      onClick={onClick}
      className={`flex items-center gap-2 py-2 px-2.5 rounded-lg cursor-pointer text-sidebar-text-primary ${
        isSelected ? "bg-sidebar-hover" : "hover:bg-sidebar-hover"
      } ${isOver ? "bg-gray-700" : ""}`}
    >
      <FolderOpen
        size={14}
        className="text-sidebar-accent-primary flex-shrink-0"
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
  );
}
