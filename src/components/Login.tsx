import React from "react";

type LoginPros = {
  handleLogin: () => void;
};

function Login({ handleLogin }: LoginPros) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col">
        <label className="text-start mb-1" htmlFor="email">Email</label>
        <input className="p-1" id="email" type="text" />
      </div>
      <div className="flex flex-col">
        <label className="text-start mb-1" htmlFor="password">Password</label>
        <input className="p-1" id="password" type="password" />
      </div>
      <button
        className="px-3 py-2 border border-black"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
