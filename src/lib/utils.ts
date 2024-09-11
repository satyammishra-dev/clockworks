import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cssColorToRgba(
  color: string
): `rgba(${number}, ${number}, ${number}, ${number})` {
  // Create a temporary div element to use for color parsing
  const tempDiv = document.createElement("div");
  tempDiv.style.color = color;

  // Append the div to the body to get computed styles
  document.body.appendChild(tempDiv);

  // Get the computed color value
  const computedColor = getComputedStyle(tempDiv).color;

  // Remove the div from the document
  document.body.removeChild(tempDiv);

  // Extract the RGBA values from the computed color
  const rgbaMatch = computedColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d*))?\)/
  );

  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // Fallback if the color is not recognized
  return `rgba(0, 0, 0, 0)`;
}

export const generateUniqueId = () => {
  return `${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
};

export const wait = async (milliseconds: number) => {
  return new Promise((res) => setTimeout(res, milliseconds));
};
