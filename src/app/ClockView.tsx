"use client";
import useOptionsEditorContext, {
  RGBAColorString,
} from "@/contexts/OptionsEditorContext";
import { DropletIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Clock from "react-custom-clock";
import ColorPicker from "./ColorPicker";

const ClockView = () => {
  const { compiledOptions, clockViewConfig, setClockViewConfig } =
    useOptionsEditorContext();
  const [clockBackdropColor, setClockBackdropColor] = useState<RGBAColorString>(
    clockViewConfig.backdrop
  );

  useEffect(() => {
    setClockViewConfig({
      backdrop: clockBackdropColor,
    });
  }, [clockBackdropColor]);
  return (
    <div
      className="w-full flex flex-col items-center px-2 py-8 border border-border/50 rounded-lg relative"
      style={{
        background: clockViewConfig.backdrop,
      }}
    >
      <div className="absolute top-2 left-2 border border-border rounded-sm p-1 flex flex-col gap-1 bg-background/80 shadow-md">
        <ColorPicker
          value={clockBackdropColor}
          onChange={(val) => setClockBackdropColor(val as RGBAColorString)}
        >
          <button
            className="h-4 w-4 border border-border"
            style={{ background: clockBackdropColor }}
          ></button>
        </ColorPicker>
        <DropletIcon size={16} color="rgb(100 100 100)" />
      </div>
      <Clock options={compiledOptions} />
    </div>
  );
};

export default ClockView;
