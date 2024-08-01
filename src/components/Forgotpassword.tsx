import React, { useState } from "react";
import "../popup/index.css";
import eye from "../eye.svg";
import eyeClose from "../eye-close.svg";

type ForgotPasswordProps = {
  handleScreen: (screen: string) => void;
  setNewRPassword: (password: string) => void;
};

function Forgotpassword({
  handleScreen,
  setNewRPassword,
}: ForgotPasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasserror, setNewpasserror] = useState("");
  const [newConfpasserror, setConfpasserror] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfpassword, setConfshowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfPasswordVisibility = () => {
    setConfshowPassword(!showConfpassword);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setNewpasserror("");
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setConfpasserror("");
  };
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSave = () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
    }
    if (newPassword.trim() === "" && confirmPassword.trim() === "") {
      setNewpasserror("New password cannot be empty");
      setConfpasserror("Confirm password cannot be empty");
    }
    if (newPassword.trim() === "") {
      setNewpasserror("New password cannot be empty");
    } else if (confirmPassword.trim() === "") {
      setConfpasserror("Confirm password cannot be empty");
    } else if (newPassword !== confirmPassword) {
      setConfpasserror("Passwords do not match");
    } else {
      setNewRPassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setNewRPassword(newPassword);
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
        <div className="flex flex-col pt-4 relative">
          <label
            className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]"
            htmlFor="newPassword"
          >
            New Password
          </label>
          <div className="relative">
            <input
              className="px-[16px] w-full py-[14px] rounded-lg border border-[#E4E2E7] focus:outline-none focus:border-[#4E00E8]"
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
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
          {newPasserror && (
            <span className="text-red-500 text-sm text-start">
              {newPasserror}
            </span>
          )}
        </div>
        <div className="flex flex-col pt-4 relative">
          <label
            className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              className="px-[16px] w-full py-[14px] rounded-lg border border-[#E4E2E7] focus:outline-none focus:border-[#4E00E8]"
              id="confirmPassword"
              type={showConfpassword ? "text" : "password"}
              placeholder="Enter confirm password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <button
              className="absolute right-[10px] top-0 bottom-0"
              onClick={toggleConfPasswordVisibility}
            >
              {showConfpassword ? (
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
          {newConfpasserror && (
            <span className="text-red-500 text-sm text-start">
              {newConfpasserror}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-3 items-center w-full pt-6 mb-2">
        <button
          className="px-3 py-2 border border-[#E4E2E7] text-[15px] rounded-lg w-full bg-[#4E00E8] text-white font-Brand-reg"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Forgotpassword;
