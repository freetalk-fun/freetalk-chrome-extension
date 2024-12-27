import axios from "axios";
import { useEffect, useState } from "react";

import { DIRECTUS_URL } from "../../environment";
import { createDirectus, authentication, rest, logout } from "@directus/sdk";

import "./App.css";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import Forgotpassword from "../../components/Forgotpassword";
import Close from "../../Close.svg";
import Home from "../../components/Home";
import Verify from "../../components/Verify";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [details, setDetails] = useState("");
  const [screen, setScreen] = useState("SIGN IN"); // SIGN IN || SIGN UP || FORGOT PASSWORD || VERIFY
  const [newPassword, setNewPassword] = useState("");

  const client = createDirectus(DIRECTUS_URL)
    .with(authentication("session"))
    .with(rest());

  function handleScreen(screen: string) {
    setScreen(screen);
  }

  async function handleLogin() {
    setIsLoggedIn(true);
    await getToken();
  }

  async function handleLogout() {
    // logout using the authentication composable
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions

    try {
      const token = getToken();
      const response = await axios.post(`${DIRECTUS_URL}/auth/logout`, {
        body: {
          refresh_token: token,
          mode: "json",
        },
      });
      removeToken();
      setIsLoggedIn(false);
      setDetails("");
      handleScreen("SIGN IN");
    } catch (error) {
      console.error("Error on logout:", error);
      return null;
    }
    console.log("clicked logout:", screen, details, isLoggedIn);
  }

  function getToken(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["token"], (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        console.log("Get TOKEN:", result.token);
        resolve(result.token); // Explicitly resolve with the correct type
      });
    });
  }

  function setToken(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ token }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        console.log("SET TOKEN!");
        resolve(); // Explicitly resolve with void
      });
    });
  }

  function removeToken(): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove("token", () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        console.log("REMOVED TOKEN!");
        resolve(); // Resolve with void
      });
    });
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
    const initialize = async () => {
      try {
        // Get the token from storage
        const token = await getToken();
        if (!token) {
          console.log("getToken failed on init");
          return;
        }
        console.log("getToken success on init", token);

        // Fetch user details
        try {
          const response: any = await axios.get(`${DIRECTUS_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response) {
            setIsLoggedIn(true);
            setDetails(response.data.data.email);
            console.log(setDetails);
            setScreen("LOGGED IN");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          await removeToken();
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    initialize();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1 className="flex justify-start font-Nor text-[40px] leading-[48px]">
          FreeTalk
        </h1>
        {!isLoggedIn && screen === "SIGN IN" && (
          <Login
            handleLogin={handleLogin}
            setToken={setToken}
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
          <Home
            handleLogout={handleLogout}
            handleScreen={handleScreen}
            email={details}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
