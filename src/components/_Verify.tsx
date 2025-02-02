import React from "react";
import "../popup/index.css";

interface VerifyProps{
    email:string,
}

function Verify({email}:VerifyProps) {
  return (
    <div className="flex flex-col gap-2.5 p-1">
      <div className="pt-5">
        <div className="text-center mb-1 text-[16px] font-Brand-reg font-medium text-[#1C1921] pt-5">
        We have sent you verification email, Please check your {email}.
        </div>
      </div>
   
    </div>
  );
}

export default Verify;
