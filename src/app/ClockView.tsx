"use client";
import useOptionsEditorContext from "@/contexts/OptionsEditorContext";
import { DropletIcon } from "lucide-react";
import React from "react";
import Clock from "react-custom-clock";

const ClockView = () => {
  const { compiledOptions } = useOptionsEditorContext();

  return (
    <div className="w-full flex flex-col items-center px-2 py-8 border border-border/50 rounded-lg relative">
      <div className="absolute top-2 left-2 border border-border rounded-sm p-1 flex flex-col gap-1 bg-background/80 shadow-md">
        <button className="h-4 w-4 border border-border"></button>
        <DropletIcon size={16} color="rgb(100 100 100)" />
      </div>
      <Clock options={compiledOptions} />
    </div>
  );
};

export default ClockView;
