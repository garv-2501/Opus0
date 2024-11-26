import { useDrag } from "react-dnd";
import { MessageCircle, Edit2, Trash2 } from "lucide-react";

interface FileItemProps {
  id: string;
  name: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FileItem({ id, name, onEdit, onDelete }: FileItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FILE",
    item: { id, name, type: "FILE" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 py-2 px-2.5 hover:bg-sidebar-hover rounded-lg cursor-pointer text-sidebar-text-primary group ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <MessageCircle
        size={14}
        className="text-sidebar-text-secondary flex-shrink-0"
      />
      <span className="flex-1 truncate pr-2 text-sm">{name}</span>
      <div className="flex-shrink-0 w-0 group-hover:w-auto overflow-hidden transition-all duration-200 flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(id);
          }}
          className="p-1 hover:bg-sidebar-hover rounded text-sidebar-text-secondary hover:text-sidebar-text-primary"
        >
          <Edit2 size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="p-1 hover:bg-sidebar-hover rounded text-sidebar-text-secondary hover:text-sidebar-text-primary"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
