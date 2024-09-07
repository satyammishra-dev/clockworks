import { Button } from "@/components/ui/button";
import React from "react";
import { Icon } from "@iconify/react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-center bg-background/80 backdrop-blur-md shadow-sm px-2 h-12 border-b border-b-border z-50">
      <div className="w-full h-full max-w-6xl flex items-center justify-between">
        <div className="h-full flex items-center">
          <span className="font-bold text-lg">Clockworks</span>
        </div>
        <div className="flex items-center h-full"></div>
      </div>
    </header>
  );
};

export default Header;
