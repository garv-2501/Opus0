import React from "react";
import { useDrop } from "react-dnd";
import { LucideIcon } from "lucide-react";

interface QuickAccessItemProps {
  folder: {
    icon: LucideIcon;
    label: string;
    items: string[];
  };
  isSelected: boolean;
  onClick: () => void;
  onDrop: (item: { id: string; type: string }) => void;
}

export function QuickAccessItem({
  folder,
  isSelected,
  onClick,
  onDrop,
}: QuickAccessItemProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FILE",
    drop: (item: { id: string; type: string }) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const Icon = folder.icon;

  return (
    <div
      ref={drop}
      onClick={onClick}
      className={`flex items-center gap-2 py-2 px-2.5 rounded-lg cursor-pointer text-sidebar-text-primary ${
        isSelected ? "bg-sidebar-hover" : "hover:bg-sidebar-hover"
      } ${isOver ? "bg-gray-700" : ""}`}
    >
      <Icon size={14} className="text-sidebar-accent-primary flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm">{folder.label}</span>
          <span className="text-xs text-sidebar-text-secondary">
            {folder.items.length}
          </span>
        </div>
      </div>
    </div>
  );
}
