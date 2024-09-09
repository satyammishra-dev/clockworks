"use client";
import React, { useCallback, useEffect, useState } from "react";
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
  children,
}: {
  value?: string;
  onChange?: (value: string) => void;
  afterChange?: (value: string) => void;
  children?: React.ReactNode;
}) => {
  const [rgbaValue, setRgbaValue] = useState<string>(
    value ?? "rgba(0, 0, 0, 0)"
  );
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const handlePickerDragEnd = useCallback(() => {
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
      <PopoverTrigger asChild>{children}</PopoverTrigger>
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
