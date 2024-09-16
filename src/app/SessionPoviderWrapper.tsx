"use client";
import GithubStarButton from "@/components/GithubStarButton";
import { SessionProvider } from "next-auth/react";
import React from "react";

const SessionPoviderWrapper = () => {
  return (
    <SessionProvider>
      <GithubStarButton />
    </SessionProvider>
  );
};

export default SessionPoviderWrapper;
