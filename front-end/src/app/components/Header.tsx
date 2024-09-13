import React from "react";
import { SiGnuprivacyguard } from "react-icons/si";

const Header: React.FC = () => {
  return (
    <nav>
      <div className="h-16 flex items-center text-xs font-bold text-[#609CEC] pl-10 shadow-md">
        <SiGnuprivacyguard size={25} className="mr-1" />
        <span className="text-2xl font-bold text-black hover:text-3xl transition-all cursor-pointer">
          SSL
        </span>
        Checker
      </div>
    </nav>
  );
};

export default Header;
