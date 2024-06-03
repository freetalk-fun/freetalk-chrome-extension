import { useState } from "react";
import "./App.css";
import Dictionary from "../../components/Dictionary";
import Login from "../../components/Login";
import Close from "../../Close.svg";
import Signup from "../../components/Signup";
import Home from "../../components/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [details,setDetails] = useState("");
  const [screen, setScreen] = useState("SIGN IN");
  function close() {
    window.close();
  }
  function handleScreen(screen: string) {
    setScreen(screen);
  }
  return (
    <div className="App">
      <div className="container">
        <img
          className="absolute right-[23px] top-[9px]"
          src={Close}
          width={"32px"}
          alt="close"
          onClick={close}
        />
        <h1 className="flex justify-start font-Nor text-[40px] leading-[48px]">
          FreeTalk
        </h1>
        {!isLoggedIn && screen === "SIGN IN" && (
          <Login
            handleLogin={() => setIsLoggedIn(true)}
            handleScreen={handleScreen}
            details={details}
            handleDetails={setDetails}
          />
        )}
        {!isLoggedIn && screen === "SIGN UP" && (
          <Signup handleSignup={() => setIsLoggedIn(true)} handleDetails={setDetails} />
        )}
        {isLoggedIn ? <Home handleSignup={() => setIsLoggedIn(false)}  email={details} /> : ""}
      </div>
    </div>
  );
}

export default App;
