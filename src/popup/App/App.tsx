import axios from "axios";
import { DIRECTUS_URL } from "../../environment";
import { useEffect, useState } from "react";

import "./App.css";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import Forgotpassword from "../../components/Forgotpassword";
import Home from "../../components/Home";
import Verify from "../../components/Verify";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [details, setDetails] = useState("");
  const [screen, setScreen] = useState("SIGN IN"); // SIGN IN || SIGN UP || FORGOT PASSWORD || VERIFY
  // const [newPassword, setNewPassword] = useState("");

  function handleScreen(screen: string) {
    setScreen(screen);
  }

  async function handleLogin() {
    try {
      await getData("token");
    } catch (error) {
      console.error("Error on login:", error);
      return;
    }
    setIsLoggedIn(true);
  }

  async function handleLogout() {
    // logout using the authentication composable
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions

    try {
      const token = getData("token");
      await axios.post(`${DIRECTUS_URL}/auth/logout`, {
        body: {
          refresh_token: token,
          mode: "json",
        },
      });
      removeData("token");
      setIsLoggedIn(false);
      setDetails("");
      handleScreen("SIGN IN");
    } catch (error) {
      console.error("Error on logout:", error);
      return null;
    }
    console.log("clicked logout:", screen, details, isLoggedIn);
  }

  function getData(value: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(value, (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return reject(chrome.runtime.lastError);
        }
        if (!result.token) {
          console.warn("Token not found in storage.");
          resolve(undefined); // Explicitly resolve undefined if no token is found
        } else {
          console.log("Get TOKEN:", result.token);
          resolve(result.token); // Resolve the token value
        }
      });
    });
  }

  function setData(token: any): Promise<void> {
    console.log("RESULT:", token);
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ token }, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return reject(chrome.runtime.lastError);
        }
        console.log("SET TOKEN!", token);
        resolve(); // Explicitly resolve with void
      });
    });
  }

  function removeData(value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(value, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return reject(chrome.runtime.lastError);
        }
        console.log("REMOVED TOKEN!");
        resolve(); // Resolve with void
      });
    });
  }

  // refresh token
  useEffect(() => {
    const initialize = async () => {
      try {
        // Get the token from storage
        const token = await getData("token");
        if (token) {
          console.log("getData success on init", token);
          // setScreen("LOGGED IN");

          // Fetch User Details
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
            await removeData("token");
          }
        }
        console.log("getData failed on init");
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
            setData={setData}
            handleScreen={handleScreen}
            details={details}
            handleDetails={setDetails}
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
          <Forgotpassword handleScreen={handleScreen} />
        )}
        {!isLoggedIn && screen === "VERIFY" && <Verify email={details} />}
        {isLoggedIn && screen === "LOGGED IN" ? (
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
