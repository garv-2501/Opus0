// frontend/src/App.jsx
// App.jsx
import HomePage from "./pages/HomePage";
import { MessageProvider } from "./contexts/MessageContext";

function App() {
  return (
    <MessageProvider>
      <HomePage />
    </MessageProvider>
  );
}

export default App;
