import React from "react";
import { Star, Clock, Pin, Archive, Trash } from "lucide-react";

interface QuickAccessProps {
  isMinimized?: boolean;
  isFileExplorer?: boolean;
  selectedFolder?: string;
  onSelect?: (folder: string) => void;
  onDrop?: (folderId: string, item: any) => void;
}

export function QuickAccess({
  isMinimized = false,
  isFileExplorer = false,
  selectedFolder = "",
  onSelect = () => {},
  onDrop = () => {},
}: QuickAccessProps) {
  const quickAccessItems = [
    { icon: Star, label: "Starred", items: 12 },
    { icon: Clock, label: "Recent", items: 24 },
    { icon: Pin, label: "Pinned", items: 8 },
    { icon: Archive, label: "Archived", items: 15 },
    { icon: Trash, label: "Trash", items: 3 },
  ];

  if (isMinimized) {
    return (
      <div className="space-y-4">
        {quickAccessItems.map((item, i) => (
          <button
            key={i}
            className="w-full flex justify-center text-sidebar-text-secondary hover:text-sidebar-text-primary hover:bg-sidebar-hover p-2 rounded-lg"
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>
    );
  }

  if (isFileExplorer) {
    return (
      <div className="space-y-0.5">
        {quickAccessItems.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 py-2 px-2.5 rounded-lg cursor-pointer text-sidebar-text-primary ${
              selectedFolder === item.label
                ? "bg-sidebar-hover"
                : "hover:bg-sidebar-hover"
            }`}
            onClick={() => onSelect(item.label)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const item = JSON.parse(
                e.dataTransfer.getData("application/json")
              );
              onDrop(item.label, item);
            }}
          >
            <item.icon
              size={14}
              className="text-sidebar-accent-primary flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">{item.label}</span>
                <span className="text-xs text-sidebar-text-secondary">
                  {item.items}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {quickAccessItems.map((item, i) => (
        <button
          key={i}
          className="flex items-center gap-2 py-2 px-2.5 text-sm hover:bg-sidebar-hover rounded-lg w-full text-sidebar-text-primary"
        >
          <item.icon
            size={14}
            className="text-sidebar-accent-primary flex-shrink-0"
          />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
