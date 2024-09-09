import React from "react";

type CornerStyling = {
  tooltipClass: string;
  tooltipCornerClass: string;
};

type TooltipDirection = Record<
  "TOP" | "LEFT" | "RIGHT" | "BOTTOM",
  CornerStyling
>;

export const TooltipDirections: TooltipDirection = {
  TOP: {
    tooltipClass:
      "origin-bottom translate-x-[-50%] left-[50%] bottom-[calc(100%_+_10px)] translate-y-[-20%] group-hover:translate-y-0",
    tooltipCornerClass: "rotate-[-135deg] bottom-[-8px]",
  }, // The tooltip would display above the trigger
  RIGHT: {
    tooltipClass:
      "origin-left translate-y-[-50%] top-[50%] left-[calc(100%_+_10px)] translate-x-[-20%] group-hover:translate-x-0",
    tooltipCornerClass: "rotate-[-45deg] left-[-8px]",
  }, // The tooltip would display to the right of the trigger
  BOTTOM: {
    tooltipClass:
      "origin-top translate-x-[-50%] left-[50%] top-[calc(100%_+_10px)] translate-y-[-20%] group-hover:translate-y-0",
    tooltipCornerClass: "rotate-[45deg] top-[-8px]",
  }, // The tooltip would display below the trigger
  LEFT: {
    tooltipClass:
      "origin-right translate-y-[-50%] top-[50%] right-[calc(100%_+_10px)] translate-x-[-20%] group-hover:translate-x-0",
    tooltipCornerClass: "rotate-[135deg] right-[-8px]",
  }, // The tooltip would display to the right of the trigger
};

type ModernTooltipProps = {
  tooltipDirection?: CornerStyling;
  delayInMs?: number;
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const ModernTooltip = ({
  tooltipDirection = TooltipDirections.TOP,
  children,
  tooltipContent,
  ...props
}: ModernTooltipProps) => {
  return (
    <div
      {...props}
      className={`relative ${props.className} group tooltip-parent`}
      style={{ zIndex: 10000000 }}
    >
      {children}

      <div
        className={`tooltip absolute bg-background border border-border rounded-xl shadow-md pointer-events-none transition duration-300 opacity-0 lll group-hover:opacity-100 scale-[0.1] lll group-hover:scale-100 ${tooltipDirection.tooltipClass}`}
      >
        <div className="tooltip-inner relative flex flex-col items-center justify-center py-[6px] px-[10px] text-foreground text-sm">
          {tooltipContent}
          <div
            className={`tooltip-corner absolute h-[14px] w-[14px] border border-border bg-background border-r-0 border-b-0 rounded-tl-md ${tooltipDirection.tooltipCornerClass}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ModernTooltip;
