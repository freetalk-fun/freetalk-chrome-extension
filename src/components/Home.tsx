import React from "react";
import "../popup/index.css";

type HomeProps = {
  email: string;
  handleLogout: () => void;
  handleScreen: (screen: string) => void;
};

function Home({ email, handleLogout }: HomeProps) {
  return (
    <div className="flex flex-col gap-2.5 p-1">
      <p className="text-start font-Brand-reg text-[13px] leading-[18px]  text-[#8D8896] pt-4">
        Hello! You are signed in:
      </p>
      <div className="pt-5">
        <div className="flex gap-1">
          <label
            className="text-start mb-1 text-[14px] font-Brand-reg font-medium text-[#1C1921]"
            htmlFor="username"
          >
            email:
          </label>
          <label className="text-start mb-1 text-[14px] font-Brand-reg">
            {email}
          </label>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-center w-full pt-6">
        <button
          className="px-3 py-2 border border-[#E4E2E7] text-[15px] rounded-lg  bg-[#4E00E8] text-white font-Brand-reg"
          onClick={() => handleLogout()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Home;
