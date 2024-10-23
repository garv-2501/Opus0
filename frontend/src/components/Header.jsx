import { useState } from "react";
import { motion } from "framer-motion"; // For smooth dropdown animations
import "../assets/fonts/dream-avenue/DreamAvenue.ttf"; // Importing the font

const Header = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <header className="bg-main-area-color text-text-color flex justify-between items-center px-6 py-4 header">
      {/* Left: Logo */}
      <div
        className="text-3xl header-logo"
        style={{ fontFamily: "Dream Avenue, sans-serif" }}
      >
        opus0
      </div>

      {/* Right: Profile Picture and Dropdown */}
      <div className="relative">
        <img
          src="https://via.placeholder.com/40" // Placeholder image for profile photo
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={toggleProfileDropdown}
        />

        {/* Profile Dropdown Menu */}
        {isProfileDropdownOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 bg-sidebar-button-color mt-2 py-2 w-48 rounded-md shadow-lg z-10"
          >
            <li
              className="px-4 py-2 hover:bg-sidebar-button-hover-color cursor-pointer"
              onClick={() => alert("Profile Settings Clicked")}
            >
              Profile Settings
            </li>
            <li
              className="px-4 py-2 hover:bg-sidebar-button-hover-color cursor-pointer"
              onClick={() => alert("Upgrade to Pro Clicked")}
            >
              Upgrade to Pro
            </li>
            <li
              className="px-4 py-2 hover:bg-sidebar-button-hover-color cursor-pointer"
              onClick={() => alert("Log Out Clicked")}
            >
              Log Out
            </li>
          </motion.ul>
        )}
      </div>
    </header>
  );
};

export default Header;
