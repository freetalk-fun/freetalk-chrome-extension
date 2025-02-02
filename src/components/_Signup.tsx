import React, { useState } from "react";
import "../popup/index.css";
import eye from "../assets/eye.svg";
import eyeClose from "../assets/eye-close.svg";
import { createDirectus, rest, registerUser } from "@directus/sdk";
import { DIRECTUS_URL } from "../environment";

type SignupProps = {
  handleSignup: () => void;
  handleDetails: (data: string) => void;
  handleScreen: (screen: string) => void;
};

function Signup({ handleSignup, handleDetails, handleScreen }: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setReshowPassword] = useState(false);
  const client = createDirectus(DIRECTUS_URL).with(rest());

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleRepeatPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRepeatPassword(e.target.value);
    setPasswordError("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleRePasswordVisibility = () => {
    setReshowPassword(!showRepassword);
  };
  const validateAndSignup = async () => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    }

    if (password !== repeatPassword) {
      setPasswordError("Passwords do not match");
      isValid = false;
    }

    if (isValid) {
      handleSignup();
      handleDetails(email);
      await client.request(registerUser(email, password));
    }
  };

  return (
    <div className="flex flex-col gap-2.5 p-1">
      <p className="text-start font-Brand-reg text-[13px] leading-[18px] text-[#8D8896] pt-4">
        Please Login or Sign Up.
      </p>
      <div className="pt-8">
        <div className="flex flex-col gap-3">
          <label
            className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="p-2 rounded-lg border border-[#E4E2E7] focus:outline-none focus:border-[#4E00E8]"
            id="email"
            type="email"
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
        <div className="flex flex-col pt-4 gap-3 relative">
          <label
            className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="px-[16px] w-full py-[14px] rounded-lg border border-[#E4E2E7] focus:outline-none focus:border-[#4E00E8]"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              className="absolute right-[10px] top-0 bottom-0"
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
        </div>
        <div className="flex flex-col pt-4 gap-3 relative">
          <label
            className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]"
            htmlFor="repeatPassword"
          >
            Repeat Password
          </label>
          <div className="relative">
            <input
              className="px-[16px] w-full py-[14px] rounded-lg border border-[#E4E2E7] focus:outline-none focus:border-[#4E00E8]"
              id="repeatPassword"
              type={showRepassword ? "text" : "password"}
              placeholder="Enter repeat password"
              value={repeatPassword}
              onChange={handleRepeatPasswordChange}
            />
            <button
              className="absolute  right-[10px] top-0 bottom-0"
              onClick={toggleRePasswordVisibility}
            >
              {showRepassword ? (
                <img
                  src={eye}
                  className="w-5 text-gray-400 cursor-pointer"
                  alt=""
                />
              ) : (
                <img
                  src={eyeClose}
                  className="w-5 text-gray-400 cursor-pointer"
                  alt=""
                />
              )}
            </button>
          </div>
          {passwordError && (
            <span className="text-red-500 text-sm mt-1 text-start">
              {passwordError}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-3 items-center w-full pt-6 pb-3">
        <button
          className="px-3 py-2 border border-[#E4E2E7] text-[15px] rounded-lg w-full bg-[#F4F4F7] text-[#4E00E8] font-Brand-reg font-bold"
          onClick={() => handleScreen("SIGN IN")}
        >
          SIGN IN
        </button>
        <button
          className="px-3 py-2 border border-[#E4E2E7] text-[15px] rounded-lg w-full bg-[#4E00E8] text-white font-Brand-reg"
          onClick={validateAndSignup}
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}

export default Signup;
