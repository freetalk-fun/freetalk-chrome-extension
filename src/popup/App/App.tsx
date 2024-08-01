import { useEffect, useState } from "react";
import "./App.css";
import Login from "../../components/Login";
import Close from "../../Close.svg";
import Signup from "../../components/Signup";
import Home from "../../components/Home";
import Forgotpassword from "../../components/Forgotpassword";
import Verify from "../../components/Verfify";
import axios from "axios";
import { createDirectus, authentication, rest } from "@directus/sdk";
import { DIRECTUS_URL } from "../../environment";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [details, setDetails] = useState("");
  const [screen, setScreen] = useState("SIGN IN");
  const [newPassword, setNewPassword] = useState("");
  const client = createDirectus(DIRECTUS_URL).with(authentication('session')).with(rest());
  function close() {
    window.close();
  }
  function handleScreen(screen: string) {
    setScreen(screen);
  }
  async function handleLogout() {
    // logout using the authentication composable
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    localStorage.removeItem("token");
    await client.logout()
    setIsLoggedIn(false);
    setDetails("");
    setScreen("SIGN IN");
  }
  async function fetchUserInfo(token: string) {
    try {
      const response = await axios.get(`${DIRECTUS_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  }

  useEffect(() => {
    // Check for token in local storage on component mount
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo(token).then(async (userInfo) => {
        if (userInfo) {
          const response: any = await axios.get(
            `${DIRECTUS_URL}/users/${userInfo.data}`
          );
          if (response) {
            setIsLoggedIn(true);
            setDetails(response.data.data.email);
          }
        }
      });
    }
  }, []);
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
            newPassword={newPassword}
          />
        )}
        {!isLoggedIn && screen === "SIGN UP" && (
          <Signup
            handleSignup={() => setScreen("VERIFY")}
            handleDetails={setDetails}
            handleScreen={handleScreen}
          />
        )}
        {!isLoggedIn && screen === "FORGOT PASSWORD" && (
          <Forgotpassword
            handleScreen={handleScreen}
            setNewRPassword={setNewPassword}
          />
        )}
        {!isLoggedIn && screen === "VERIFY" && <Verify email={details} />}
        {isLoggedIn ? (
          <Home handleSignup={() => handleLogout()} email={details} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
