"use client";
import React, { createContext, useContext, useState } from "react";
import html2canvas from "html2canvas";

export type ClockScreenshotContextType = {
  screenshotMode: boolean;
  takeScreenshot: () => Promise<string | undefined>;
  lastScreenshot: string | undefined;
  clearScreenshot: () => void;
  setScreenshotTarget: React.Dispatch<
    React.SetStateAction<React.RefObject<HTMLDivElement> | null>
  >;
};

const ClockScreenshotContext = createContext<ClockScreenshotContextType | null>(
  null
);

export const ClockScreenshotContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isScreenshotMode, setScreenshotMode] = useState(false);
  const [lastScreenshot, setLastScreenshot] = useState<string>();
  const [screenshotTarget, setScreenshotTarget] =
    useState<React.RefObject<HTMLDivElement> | null>(null);

  const takeScreenshot = async () => {
    if (!screenshotTarget) {
      console.error("Screenshot target could not be found.");
      return;
    }
    const clockView = screenshotTarget.current;
    if (!clockView) {
      console.error("Screenshot target could not be found.");
      return;
    }

    setScreenshotMode(true);
    let canvas,
      imgData: string | undefined = undefined;
    try {
      canvas = await html2canvas(clockView, { scale: 1 });
      imgData = canvas.toDataURL("image/jpg");
      setLastScreenshot(imgData);
    } catch (e) {
      console.error("Screenshot could not be taken:", e);
      setLastScreenshot(undefined);
    }
    setScreenshotMode(false);
    return imgData;
  };

  const clearScreenshot = () => {
    setLastScreenshot(undefined);
  };

  return (
    <ClockScreenshotContext.Provider
      value={{
        screenshotMode: isScreenshotMode,
        takeScreenshot,
        lastScreenshot,
        clearScreenshot,
        setScreenshotTarget,
      }}
    >
      {children}
    </ClockScreenshotContext.Provider>
  );
};

const useClockScreenshotContext = (): ClockScreenshotContextType => {
  const ctx = useContext(ClockScreenshotContext);
  if (ctx === null)
    throw new Error(
      "useClockScreenshotContext must be used within ClockScreenshotContextProvider"
    );
  return ctx;
};

export default useClockScreenshotContext;
