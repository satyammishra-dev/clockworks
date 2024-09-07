"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ColorPicker = ({
  value,
  onChange,
  afterChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
  afterChange?: (value: string) => void;
} & React.HTMLAttributes<HTMLButtonElement>) => {
  const [rgbaValue, setRgbaValue] = useState<string>();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (!buttonRef.current) return;
    const initialRGBA = getComputedStyle(buttonRef.current).backgroundColor;
    setRgbaValue(initialRGBA);
  }, [buttonRef]);

  const handlePickerDragEnd = useCallback(() => {
    console.log("ccc", rgbaValue);
    afterChange?.(rgbaValue ?? "rgba(0, 0, 0, 0)");
  }, [rgbaValue]);

  useEffect(() => {
    if (isPopoverOpen) {
      window.addEventListener("mouseleave", handlePickerDragEnd);
      window.addEventListener("mouseup", handlePickerDragEnd);
      window.addEventListener("touchend", handlePickerDragEnd);
    }
    return () => {
      window.removeEventListener("mouseleave", handlePickerDragEnd);
      window.removeEventListener("mouseup", handlePickerDragEnd);
      window.removeEventListener("touchend", handlePickerDragEnd);
    };
  }, [isPopoverOpen, handlePickerDragEnd]);

  return (
    <Popover open={isPopoverOpen} onOpenChange={(val) => setPopoverOpen(val)}>
      <PopoverTrigger asChild>
        <button
          style={{
            background: rgbaValue ?? value,
          }}
          ref={buttonRef}
          className="h-6 w-8 border border-border rounded-md"
        ></button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-8">
        <RgbaStringColorPicker
          color={rgbaValue}
          onChange={(val) => {
            setRgbaValue(val);
            onChange?.(val);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
