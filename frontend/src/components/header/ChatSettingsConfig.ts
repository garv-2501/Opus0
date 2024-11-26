import {
  LucideIcon,
  Sparkles,
  Brain,
  Zap,
  MessageSquare,
  Keyboard,
  Sliders,
} from "lucide-react";

interface ChatSettingOption {
  id: string;
  label: string;
  description: string;
  cost?: "low" | "medium" | "high";
}

interface ChatSettingSection {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  options: ChatSettingOption[];
}

export const chatSettings: ChatSettingSection[] = [
  {
    icon: Sparkles,
    title: "Enhanced Responses",
    description: "Customize AI responses for specific domains",
    iconColor: "text-yellow-400",
    options: [
      {
        id: "programming",
        label: "Programming",
        description: "Optimized for code and technical discussions",
      },
      {
        id: "creative",
        label: "Content Creation",
        description: "Enhanced for creative writing and content",
      },
      {
        id: "sales",
        label: "Sales",
        description: "Tailored for business and sales communication",
      },
      {
        id: "academic",
        label: "Academic Writing",
        description: "Structured for academic and research content",
      },
    ],
  },
  {
    icon: Brain,
    title: "Memory & Context",
    description: "Manage how the AI handles conversation history",
    iconColor: "text-purple-400",
    options: [
      {
        id: "useable-context",
        label: "Use Efficient Context",
        description: "Optimize for performance and cost",
        cost: "low",
      },
      {
        id: "all-context",
        label: "Use Complete Context",
        description: "Maximum accuracy with full history",
        cost: "high",
      },
    ],
  },
  {
    icon: Zap,
    title: "Response Speed",
    description: "Balance between speed and quality",
    iconColor: "text-blue-400",
    options: [
      {
        id: "fast",
        label: "Fast Responses",
        description: "Quicker replies with good quality",
        cost: "low",
      },
      {
        id: "balanced",
        label: "Balanced Mode",
        description: "Optimal speed-quality ratio",
        cost: "medium",
      },
    ],
  },
  {
    icon: MessageSquare,
    title: "Chat Behavior",
    description: "Customize interaction style",
    iconColor: "text-green-400",
    options: [
      {
        id: "concise",
        label: "Concise Mode",
        description: "Brief, to-the-point responses",
      },
      {
        id: "detailed",
        label: "Detailed Mode",
        description: "Comprehensive, thorough answers",
      },
    ],
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description: "Customize keyboard controls",
    iconColor: "text-orange-400",
    options: [
      {
        id: "quick-commands",
        label: "Quick Commands",
        description: "Enable slash commands for quick actions",
      },
      {
        id: "navigation",
        label: "Navigation Keys",
        description: "Use arrow keys for chat navigation",
      },
    ],
  },
  {
    icon: Sliders,
    title: "Advanced Settings",
    description: "Fine-tune AI behavior",
    iconColor: "text-pink-400",
    options: [
      {
        id: "temperature",
        label: "Response Creativity",
        description: "Adjust AI response randomness",
      },
      {
        id: "max-length",
        label: "Maximum Length",
        description: "Set response length limits",
      },
    ],
  },
];
