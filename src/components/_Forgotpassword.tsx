import React, { useState } from "react";
import "../popup/index.css";
import { DIRECTUS_URL } from "../environment";

type ForgotpasswordProps = {
  handleScreen: (screen: string) => void;
};

function Forgotpassword({ handleScreen }: ForgotpasswordProps) {
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function resetPassword(email: string) {
    try {
      const response = await fetch(`${DIRECTUS_URL}/auth/password/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Directly set the email here
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("We've sent a password reset email to:", email);
    } catch (error) {
      console.error("Error on password reset request:", error);
      return null;
    }
    console.log("clicked logout:");
  }

  const handleSend = () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
    } else {
      resetPassword(email);
      handleScreen("SIGN IN");
    }
  };

  return (
    <div className="flex flex-col gap-2.5 p-1">
      <p className="text-start font-Brand-reg text-[13px] leading-[18px]  text-[#8D8896] pt-4">
        Forgot Password
      </p>
      <div className="pt-8">
        <div className="flex flex-col">
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
            <span className="text-red-500 text-sm text-start">
              {emailError}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-3 items-center w-full pt-6 mb-2">
        <button
          className="px-3 py-2 border border-[#E4E2E7] text-[15px] rounded-lg w-full bg-[#4E00E8] text-white font-Brand-reg"
          onClick={handleSend}
        >
          Send Reset Email
        </button>
      </div>
    </div>
  );
}

export default Forgotpassword;
