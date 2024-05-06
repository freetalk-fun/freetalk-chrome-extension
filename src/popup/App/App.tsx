import { useState } from "react";
import "./app.css";
import Dictionary from "../../components/Dictionary";
import Login from "../../components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="App">
      <div className="container">
        {!isLoggedIn ? (
          <Login handleLogin={() => setIsLoggedIn(true)} />
        ) : (
          <Dictionary />
        )}
      </div>
    </div>
  );
}

export default App;
