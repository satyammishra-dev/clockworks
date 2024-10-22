import React from "react";
import Navbar from "./Navbar";
import SessionPoviderWrapper from "./SessionPoviderWrapper";

const Header = async () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-center bg-background/80 backdrop-blur-md shadow-sm px-2 h-12 border-b border-b-border z-50">
      <div className="w-full h-full max-w-6xl flex items-center justify-between">
        <div className="h-full flex items-center">
          <a className="font-bold text-lg" href="/">
            Clockworks
          </a>
        </div>
        <div className="flex items-center gap-2 h-full">
          <Navbar />
          <SessionPoviderWrapper />
        </div>
      </div>
    </header>
  );
};

export default Header;
