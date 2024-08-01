import React, { useState } from "react";
import "../popup/index.css";
import eye from "../eye.svg";
import eyeClose from "../eye-close.svg";
import { createDirectus, rest, authentication, login } from "@directus/sdk";
import { DIRECTUS_URL } from "../environment";

type LoginPros = {
  handleLogin: () => void;
  handleScreen: (screen: string) => void;
  details: string;
  handleDetails: (data: string) => void;
  newPassword?: string;
};

function Login({
  handleLogin,
  handleScreen,
  handleDetails,
  newPassword,
}: LoginPros) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
    const client = createDirectus(DIRECTUS_URL)
    .with(authentication('session'))
    .with(rest());
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validateAndLogin = async () => {
    let isValid = true;

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    }

    // Validate password
    if (password.trim() === "") {
      setError("Password cannot be empty");
      isValid = false;
    }

    if (isValid) {
      try {
        const result: any = await client.request(login(email, password));
        setError("");
        handleLogin();
        localStorage.setItem("token", result.access_token);
        handleDetails(email);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setError(
            "Invalid credentials or email not verified. Please check your details and try again, or verify your email."
          );
        } else {
          setError(`An error occurred: ${error.message}`);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-2.5 p-1">
      <p className="text-start font-Brand-reg text-[13px] leading-[18px]  text-[#8D8896] pt-4">
        Please Login or Sign Up.
      </p>
      <div className="pt-8">
        <div className="flex flex-col gap-3">
          <label
            className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]"
            htmlFor="username"
          >
            Email
          </label>
          <input
            className="px-[16px] py-[14px]  rounded-lg border border-[#E4E2E7] focus:outline-none focus:border-[#4E00E8]"
            id="email"
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && (
            <span className="text-red-500 text-sm mt-1 text-start">
              {emailError}
            </span>
          )}
        </div>
        {/* <div className="flex flex-col pt-4 gap-3">
        <label className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]" htmlFor="password">
          Password
        </label>
        <input
          className="px-[16px] py-[14px] rounded-lg border border-[#E4E2E7] focus:outline-none focus:border-[#4E00E8]"
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
        />
        {error && <span className="text-red-500 text-sm mt-1 text-start">{error}</span>}
      </div> */}
        <div className="flex flex-col pt-4 gap-3 relative">
          <label
            className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="px-[16px] py-[14px] w-full rounded-lg border border-[#E4E2E7] focus:outline-none focus:border-[#4E00E8]"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              className="absolute  right-[10px] top-0 bottom-0"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <img
                  src={eye}
                  className="w-5  text-gray-400 cursor-pointer"
                  alt=""
                />
              ) : (
                <img
                  src={eyeClose}
                  className="w-5  text-gray-400 cursor-pointer"
                  alt=""
                />
              )}
            </button>
          </div>
          {error && (
            <span className="text-red-500 text-sm mt-1 text-start">
              {error}
            </span>
          )}
        </div>
      </div>
      <h6
        className="text-[12px] text-[#4E00E8] text-start cursor-pointer"
        onClick={() => handleScreen("FORGOT PASSWORD")}
      >
        Forgot Password?
      </h6>
      <div className="flex gap-3 items-center w-full pt-6">
        <button
          className="px-3 py-2 border border-[#E4E2E7] text-[15px] rounded-lg w-full bg-[#4E00E8] text-white font-Brand-reg"
          onClick={validateAndLogin}
        >
          SIGN IN
        </button>
        <button
          className="px-3 py-2 border border-[#E4E2E7] text-[15px] rounded-lg w-full bg-[#F4F4F7] text-[#4E00E8] font-Brand-reg font-bold"
          onClick={() => handleScreen("SIGN UP")}
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}

export default Login;
