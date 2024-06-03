import React, { useState } from "react";
import "../popup/index.css";

type LoginPros = {
  handleLogin: () => void;
  handleScreen: (screen:string) => void;
  details:string,
  handleDetails:(data:string)=> void
};

function Login({ handleLogin,handleScreen,handleDetails }: LoginPros) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("")
  };
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAndLogin = () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
    }
    if (password.trim() === "") {
      setError("Password cannot be empty");
    } else {
      if(validateEmail(email)){
        if(email === "test@yopmail.com" && password === "Test@123"){
          setError("");
          handleLogin();
          handleDetails(email)
        }
        else{
          setError("wrong email or password")
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
        <label className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]" htmlFor="username">
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
           {emailError && <span className="text-red-500 text-sm mt-1 text-start">{emailError}</span>}
      </div>
      <div className="flex flex-col pt-4 gap-3">
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
      </div>
      </div>
      <div className="flex gap-3 items-center w-full pt-6">
        <button
          className="px-3 py-2 border border-[#E4E2E7] text-[15px] rounded-lg w-full bg-[#4E00E8] text-white font-Brand-reg"
          onClick={validateAndLogin}
        >
          SIGN IN
        </button>
        <button
          className="px-3 py-2 border border-[#E4E2E7] text-[15px] rounded-lg w-full bg-[#F4F4F7] text-[#4E00E8] font-Brand-reg font-bold"
          onClick={()=> handleScreen('SIGN UP')}
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}

export default Login;
