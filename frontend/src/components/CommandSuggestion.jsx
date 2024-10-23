import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import commands from "../commands"; // Ensure the commands file is properly referenced

const CommandSuggestion = ({
  input,
  handleCommandSelect,
  selectedIndex,
  setSelectedIndex,
}) => {
  const [filteredCommands, setFilteredCommands] = useState([]);

  useEffect(() => {
    let commandsToShow = Object.entries(commands);

    if (input && input.length > 1) {
      commandsToShow = commandsToShow.filter(([command]) =>
        command.includes(input.slice(1))
      );
    }
    setFilteredCommands(commandsToShow);
  }, [input]);

  const handleMouseEnter = (index) => {
    setSelectedIndex(index);
  };

  const handleClick = (command) => {
    handleCommandSelect(command);
  };

  return (
    <div
      className="absolute w-full bg-gray-800 p-4 rounded-t-lg"
      style={{ bottom: "100%", marginBottom: "8px" }}
    >
      {filteredCommands.map(([command, { description }], index) => (
        <div
          key={command}
          className={`text-white mb-2 ${
            index === selectedIndex ? "bg-gray-600" : ""
          }`}
          onMouseEnter={() => handleMouseEnter(index)}
          onClick={() => handleClick(command)}
          style={{ cursor: "pointer" }}
        >
          <span className="font-bold">{command}</span>: {description}
        </div>
      ))}
    </div>
  );
};

CommandSuggestion.propTypes = {
  input: PropTypes.string.isRequired,
  handleCommandSelect: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  setSelectedIndex: PropTypes.func.isRequired, // Added setSelectedIndex prop type
};

export default CommandSuggestion;
