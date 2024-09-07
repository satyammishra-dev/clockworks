"use client";
import { Button } from "@/components/ui/button";
import GitHubButton from "react-github-btn";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import GithubStarButton from "@/components/GithubStarButton";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-center bg-background shadow-sm px-2 h-12 border-b border-b-border">
      <div className="w-full h-full max-w-6xl flex items-center justify-between">
        <div className="h-full flex items-center">
          <span className="font-bold text-lg">Clockworks</span>
        </div>
        <div className="flex items-center h-full">
          {/* <GitHubButton
            href="https://github.com/satyam-mishra-pce/react-custom-clock"
            data-color-scheme="no-preference: light; light: light; dark: dark;"
            data-size="large"
            data-show-count="true"
            aria-label="Star satyam-mishra-pce/react-custom-clock on GitHub"
          >
            Star
          </GitHubButton> */}
          <GithubStarButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
