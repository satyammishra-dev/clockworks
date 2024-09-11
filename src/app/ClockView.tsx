"use client";
import useOptionsEditorContext, {
  RGBAColorString,
} from "@/contexts/OptionsEditorContext";
import { DropletIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Clock from "react-custom-clock";
import ColorPicker from "./ColorPicker";
import { Icon } from "@iconify/react/dist/iconify.js";
import useClockScreenshotContext from "@/contexts/ClockScreenshotContext";

const FALLBACK_CLOCK_SIZE = 400;
const ZOOM_INTERVAL = 10;

const ClockView = () => {
  const { compiledOptions, clockViewConfig, setClockViewConfig } =
    useOptionsEditorContext();
  const [clockBackdropColor, setClockBackdropColor] = useState<RGBAColorString>(
    clockViewConfig.backdrop
  );
  const [zoomAmount, setZoomAmount] = useState<number>(
    clockViewConfig.zoom.amount
  );
  const [isZoomAutomatic, setZoomAutomatic] = useState<boolean>(
    clockViewConfig.zoom.isAutomatic
  );
  const [showZoomAmount, setShowZoomAmount] = useState(false);
  const { setScreenshotTarget } = useClockScreenshotContext();
  const thisRef = useRef<HTMLDivElement>(null);
  const clockWrapperRef = useRef<HTMLDivElement>(null);

  const calcAutomaticZoomAmount = (
    clockSize: number,
    clockViewWidth: number
  ) => {
    const clockView = thisRef.current;
    if (!clockView) return undefined;
    const expectedClockViewWidth = Math.min(clockSize, clockViewWidth - 40);
    const percentage = (expectedClockViewWidth * 100) / clockSize;
    const normalizedPercentage =
      Math.floor(percentage / ZOOM_INTERVAL) * ZOOM_INTERVAL;
    return normalizedPercentage;
  };

  const calcClockViewHeight = (
    size: number | undefined,
    zoomAmount: number
  ) => {
    if (size === undefined) size = FALLBACK_CLOCK_SIZE;
    return (size * zoomAmount) / 100 + 80;
  };
  const [clockViewHeight, setClockViewHeight] = useState(
    calcClockViewHeight(compiledOptions.size, zoomAmount)
  );

  // Update ClockView Config on change in backdrop color
  useEffect(() => {
    setClockViewConfig((prev) => ({
      ...prev,
      backdrop: clockBackdropColor,
    }));
  }, [clockBackdropColor]);

  // Add a resize observer to check for width changes in ClockView, and
  // calculate automatic zoom amount if automatic zoom mode is on.
  useEffect(() => {
    const clockView = thisRef.current;
    if (!clockView) return;
    if (!isZoomAutomatic) return;
    const obs = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      const width = entries[0].borderBoxSize[0].inlineSize;
      const automaticZoomAmount = calcAutomaticZoomAmount(
        compiledOptions.size ?? FALLBACK_CLOCK_SIZE,
        width
      );
      if (automaticZoomAmount) {
        setZoomAmount(automaticZoomAmount);
      }
    });
    obs.observe(clockView);
    return () => {
      obs.unobserve(clockView);
      obs.disconnect();
    };
  }, [thisRef, isZoomAutomatic]);

  // Set the clockview height according to the calculated zoom amount, and intrinsic clock size.
  useEffect(() => {
    setClockViewHeight(calcClockViewHeight(compiledOptions.size, zoomAmount));
  }, [compiledOptions.size, zoomAmount]);

  // Disply zoom amount text when showZoomAmount is true
  useEffect(() => {
    if (showZoomAmount) {
      const timer = setTimeout(() => {
        setShowZoomAmount(false);
      }, 1200);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showZoomAmount]);

  // Update the ClockViewConfig and showZoomAMount for change in zoomAmount, and isZoomAutomatic
  useEffect(() => {
    setShowZoomAmount(true);
    setClockViewConfig((prev) => ({
      ...prev,
      zoom: { isAutomatic: isZoomAutomatic, amount: zoomAmount },
    }));
  }, [isZoomAutomatic, zoomAmount]);

  // Update the screenshot target for each clock wrapper ref change:
  useEffect(() => {
    setScreenshotTarget(clockWrapperRef);
  }, [clockWrapperRef]);

  return (
    <div
      className="w-full px-2 py-8 border border-border/50 rounded-lg relative overflow-hidden"
      style={{
        background: clockBackdropColor,
        height: `${clockViewHeight}px`,
      }}
      ref={thisRef}
    >
      <div
        className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-0"
        ref={clockWrapperRef}
      >
        <Clock
          options={compiledOptions}
          style={{
            scale: `${zoomAmount}%`,
          }}
          className="z-0"
        />
      </div>
      <div className="absolute top-2 left-2 border border-border rounded-sm p-1 flex flex-col gap-1 bg-background/80 backdrop-blur-md shadow-md z-10">
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
      <div className="absolute top-2 right-2 flex flex-col items-end gap-2 z-10 group">
        <div className="border border-border rounded-sm flex flex-col p-1 bg-background/80 backdrop-blur-md shadow-md overflow-hidden">
          <button
            className={`h-6 w-6 ${
              isZoomAutomatic ? "bg-slate-200" : ""
            } hover:bg-slate-100 flex items-center justify-center`}
            onClick={() => {
              setZoomAutomatic((prev) => !prev);
            }}
          >
            <Icon icon={"lucide:maximize"} fontSize={14} />
          </button>
          <button
            className="h-6 w-6 hover:bg-slate-100 flex items-center justify-center disabled:text-muted-foreground disabled:hover:bg-transparent"
            disabled={zoomAmount >= 100}
            onClick={() => {
              setZoomAutomatic(false);
              setZoomAmount((prev) => Math.min(100, prev + ZOOM_INTERVAL));
            }}
          >
            <Icon icon={"lucide:plus"} fontSize={14} />
          </button>
          <button
            className="h-6 w-6 hover:bg-slate-100 flex items-center justify-center disabled:text-muted-foreground disabled:hover:bg-transparent"
            disabled={zoomAmount <= ZOOM_INTERVAL}
            onClick={() => {
              setZoomAutomatic(false);
              setZoomAmount((prev) => Math.max(0, prev - ZOOM_INTERVAL));
            }}
          >
            <Icon icon={"lucide:minus"} fontSize={14} />
          </button>
          <span className="h-6 w-6 mt-1 flex items-center justify-center">
            <Icon icon={"lucide:zoom-in"} fontSize={14} />
          </span>
        </div>
        <span
          className={`block bg-background/80 backdrop-blur-md px-1 py-0.5 rounded-md border border-border text-sm select-none ${
            showZoomAmount ? "opacity-100" : "opacity-0"
          } group-hover:opacity-100 transition`}
        >
          {isZoomAutomatic ? `Fit (${zoomAmount}%)` : `${zoomAmount}%`}
        </span>
      </div>
    </div>
  );
};

export default ClockView;
