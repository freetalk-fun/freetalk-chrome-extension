import React, { useState } from "react";
import "../popup/index.css";

type SignupPros = {
  handleSignup: () => void;
  handleDetails:(data:string)=> void
};

function Signup({ handleSignup,handleDetails }: SignupPros) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
    setPasswordError("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAndSignup = () => {
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
      handleDetails(email)
    }
  };

  return (
    <div className="flex flex-col gap-2.5 p-1">
     <p className="text-start font-Brand-reg text-[13px] leading-[18px] text-[#8D8896] pt-4">
        Please Login or Sign Up.
      </p>
      <div className="pt-8">
      <div className="flex flex-col gap-3">
        <label className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]" htmlFor="email">
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
        {emailError && <span className="text-red-500 text-sm mt-1 text-start">{emailError}</span>}
      </div>
      <div className="flex flex-col pt-4 gap-3">
        <label className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]" htmlFor="password">
          Password
        </label>
        <input
          className="p-2 rounded-lg border border-[#E4E2E7] focus:outline-none focus:border-[#4E00E8]"
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div className="flex flex-col pt-4 gap-3">
        <label className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]" htmlFor="repeatPassword">
          Repeat Password
        </label>
        <input
          className="p-2 rounded-lg border border-[#E4E2E7] focus:outline-none focus:border-[#4E00E8]"
          id="repeatPassword"
          type="password"
          placeholder="Enter repeat password"
          value={repeatPassword}
          onChange={handleRepeatPasswordChange}
        />
        {passwordError && <span className="text-red-500 text-sm mt-1 text-start">{passwordError}</span>}
      </div>
      </div>
      <div className="flex gap-3 items-center w-full pt-6 pb-3">
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
