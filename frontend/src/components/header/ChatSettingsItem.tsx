import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LucideIcon } from "lucide-react";

interface Option {
  id: string;
  label: string;
  description: string;
  cost?: "low" | "medium" | "high";
}

interface ChatSettingsItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  options: Option[];
}

export function ChatSettingsItem({
  icon: Icon,
  title,
  description,
  iconColor,
  options,
}: ChatSettingsItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  return (
    <div className="border-b border-[#2C3238] last:border-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-3 p-3 hover:bg-[#2C3238] transition-colors duration-200"
      >
        <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-200">{title}</div>
          <div className="text-xs text-gray-400">{description}</div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-start gap-3 py-2 cursor-pointer group"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => toggleOption(option.id)}
                      className="w-4 h-4 border-2 border-gray-600 rounded bg-transparent checked:bg-blue-500 checked:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-200">
                        {option.label}
                      </span>
                      {option.cost && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            option.cost === "low"
                              ? "bg-green-500/20 text-green-400"
                              : option.cost === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {option.cost}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {option.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
