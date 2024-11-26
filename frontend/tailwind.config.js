//----------------------------------------------------------------
// Path: frontend/tailwind.config.js
// Main Theme
// --------------------------------------------------------------
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Dark mode
      colors: {
        "base-100": "#FFFFFF", // Base background color
        info: "#3ABFF8", // Info color
        success: "#36D399", // Success color
        warning: "#FBBD23", // Warning color
        error: "#F87272", // Error color
        "text-color": "#FFFFFF", // Text color
        "main-area-color": "#070909", // Main area color
        "search-bar-color": "#17191d", // Search bar color
        "search-bar-button-color": "#495263", // Search bar color
        "search-bar-button-hover-color": "#495263", // Search bar
        "user-message-color": "#b4c6c760", // User message color
        sidebar: {
          bg: "#17191d",
          hover: "#222222",
          border: "#2A2A2A",
          text: {
            primary: "#FFFFFF",
            secondary: "#A1A1AA",
          },
          accent: {
            primary: "#3ABFF8",
            purple: "#9333EA",
          },
        },
      },

      // Light mode
      // colors: {
      // "base-100": "#FFFFFF", // Base background color
      // info: "#3ABFF8", // Info color
      // success: "#36D399", // Success color
      // warning: "#FBBD23", // Warning color
      // error: "#F87272", // Error color
      // "text-color": "#000000", // Text color
      // "main-area-color": "#f6f8f8", // Main area color
      // "sidebar-color": "#e4eaf5", // Sidebar color
      // "sidebar-button-color": "#b4bada", // Search bar color
      // "sidebar-button-hover-color": "#bfc4e3", // Search bar
      // "search-bar-color": "#e4eaf5", // Search bar color
      // "search-bar-button-color": "#b4bada", // Search bar color
      // "search-bar-button-hover-color": "#bfc4e3", // Search bar
      // "user-message-color": "#e4eaf5", // User message color
      // },
    },
  },
  plugins: [],
};

//----------------------------------------------------------------
// Purple Theme
// --------------------------------------------------------------
// colors: {
//   "base-100": "#FFFFFF", // Base background color
//   info: "#3ABFF8", // Info color
//   success: "#36D399", // Success color
//   warning: "#FBBD23", // Warning color
//   error: "#F87272", // Error color
//   "main-area-color": "#070d13", // Main area color
//   "sidebar-color": "#46307930", // Sidebar color
//   "sidebar-button-color": "#46307990", // Search bar color
//   "sidebar-button-hover-color": "#463079", // Search bar
//   "search-bar-color": "#46307930", // Search bar color
//   "search-bar-button-color": "#46307990", // Search bar color
//   "search-bar-button-hover-color": "#463079", // Search bar
//   "user-message-color": "#94b3d560", // User message color
// },

// --------------------------------------------------------------
// Cyan Theme
// --------------------------------------------------------------
// colors: {
//   "base-100": "#FFFFFF", // Base background color
//   info: "#3ABFF8", // Info color
//   success: "#36D399", // Success color
//   warning: "#FBBD23", // Warning color
//   error: "#F87272", // Error color
//   "main-area-color": "#060e13", // Main area color
//   "sidebar-color": "#135f8c40", // Sidebar color
//   "sidebar-button-color": "#135f8c80", // Search bar color
//   "sidebar-button-hover-color": "#135f8c", // Search bar
//   "search-bar-color": "#135f8c40", // Search bar color
//   "search-bar-button-color": "#135f8c80", // Search bar color
//   "search-bar-button-hover-color": "#135f8c", // Search bar
//   "user-message-color": "#85c1e570", // User message color
// },
