"use client";
import { Button } from "@/components/ui/button";
import useOptionsEditorContext, {
  OptionData,
} from "@/contexts/OptionsEditorContext";
import autoAnimate from "@formkit/auto-animate";
import { ChevronUpIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Switch from "react-switch";
import ColorPicker from "./ColorPicker";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react/dist/iconify.js";
import ModernTooltip, {
  TooltipDirections,
} from "@/components/ui/modern-tooltip";
import useSavedClockStorageContext from "@/contexts/SavedClockStorageContext";
import { generateUniqueId } from "@/lib/utils";
import useClockScreenshotContext from "@/contexts/ClockScreenshotContext";

const OptionRenderer = ({
  optionData,
  editOption,
}: {
  optionData: OptionData;
  editOption: (keypath: string, value: any) => void;
}) => {
  const isPrimitive =
    optionData.type !== "object" && optionData.currentValue !== undefined;
  const showProperty =
    !isPrimitive &&
    (optionData.currentValue as OptionData[]).find(
      (item) => item.key === "show"
    );
  const [isExpanded, setExpanded] = useState(false);
  const expandedRef = useRef(null);
  const switchRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    expandedRef.current && autoAnimate(expandedRef.current);
  }, [expandedRef]);

  useEffect(() => {
    if (!showProperty) return;
    if (showProperty.currentValue === false) {
      setExpanded(showProperty.currentValue);
    }
  }, [showProperty]);

  //color
  const [value, setValue] = useState(optionData.currentValue);

  useEffect(() => {
    setValue(optionData.currentValue);
  }, [optionData.currentValue]);

  return (
    <>
      {isPrimitive ? (
        <div className="">
          <div className="flex items-center justify-between py-1 px-2">
            <span>{optionData.key}</span>
            {optionData.type === "color" && (
              <div className="flex items-center gap-1">
                <ColorPicker
                  value={value}
                  afterChange={(val) => editOption("", val)}
                >
                  <button
                    style={{
                      background: value,
                    }}
                    className="h-6 w-8 border border-border rounded-md"
                  ></button>
                </ColorPicker>
                <span>{value}</span>
              </div>
            )}
            {optionData.type === "number" && (
              <div className="flex items-center gap-1">
                <Input
                  className="w-20 h-8"
                  type="number"
                  value={value}
                  onChange={(evt) => editOption("", parseInt(evt.target.value))}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`border border-border rounded-lg ${
            isExpanded ? "" : "hover:bg-slate-50"
          }`}
          onClick={(evt) => {
            if (isExpanded) return;
            if (
              switchRef.current &&
              switchRef.current.contains(evt.target as Node)
            )
              return;
            if (showProperty && showProperty.currentValue === false) return;
            setExpanded(true);
          }}
        >
          <div className="flex items-center justify-between p-2">
            <strong>{optionData.key}</strong>
            <div className="flex items-center gap-1">
              {showProperty && (
                <span ref={switchRef} className="flex items-center">
                  <Switch
                    checked={showProperty.currentValue as boolean}
                    onChange={(value) => editOption("show", value)}
                    checkedIcon={false}
                    onColor="#0077ff"
                    offColor="#dddddd"
                    uncheckedIcon={false}
                    height={22}
                    width={40}
                    handleDiameter={16}
                  />
                </span>
              )}
              <Button
                size={"xs"}
                variant={"ghost"}
                onClick={() => setExpanded((prev) => !prev)}
                disabled={
                  showProperty ? showProperty.currentValue === false : false
                }
              >
                <ChevronUpIcon
                  className={`${isExpanded ? "" : "rotate-180"} transition-all`}
                  size={16}
                />
              </Button>
            </div>
          </div>
          <div
            className={`px-1 ${isExpanded ? "py-1" : ""} flex flex-col gap-1`}
            ref={expandedRef}
          >
            {isExpanded &&
              (
                (optionData.currentValue ??
                  optionData.defaultValue) as OptionData[]
              ).map((subOptionData) => {
                if (subOptionData.key === "show") return null;
                return (
                  <OptionRenderer
                    optionData={subOptionData}
                    editOption={(keypath: string, value: any) => {
                      editOption(subOptionData.key + "/" + keypath, value);
                    }}
                    key={subOptionData.key}
                  />
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

const OptionsEditor = () => {
  const { edittedOptions, editOption, compiledOptions, clockViewConfig } =
    useOptionsEditorContext();
  const { saveClock } = useSavedClockStorageContext();
  const { takeScreenshot } = useClockScreenshotContext();

  const [isCopied, setCopied] = useState(false);

  const [saveMode, setSaveMode] = useState<
    "IDLE" | "SAVING" | "ERROR" | "SAVED"
  >("IDLE");

  const saveClockOptions = async () => {
    setSaveMode("SAVING");
    const imageData = await takeScreenshot();
    if (!imageData) {
      setSaveMode("ERROR");
      setTimeout(() => {
        setSaveMode("IDLE");
      }, 2000);
      return;
    }
    try {
      saveClock({
        metadata: {
          id: generateUniqueId(),
          rccVersion: "1.0.9",
        },
        presentation: {
          backdrop: clockViewConfig.backdrop,
          name: "Clock",
          thumbnail: imageData,
        },
        data: edittedOptions,
      });
    } catch {
      setSaveMode("ERROR");
      setTimeout(() => {
        setSaveMode("IDLE");
      }, 2000);
    }
    setSaveMode("SAVED");
    setTimeout(() => {
      setSaveMode("IDLE");
    }, 2000);
  };

  const copyCompiledOptions = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(JSON.stringify(compiledOptions));
    setCopied(true);
  };

  useEffect(() => {
    if (!isCopied) return;
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [isCopied]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Icon icon={"iconamoon:options"} fontSize={20} />
          <span>Options</span>
        </h2>
        <div className="flex items-center gap-2">
          <ModernTooltip
            tooltipDirection={TooltipDirections.BOTTOM}
            tooltipContent={
              saveMode === "IDLE"
                ? "Save"
                : saveMode === "SAVING"
                ? "Saving..."
                : saveMode === "ERROR"
                ? "Error"
                : "Saved"
            }
            style={{ zIndex: 10 }}
          >
            <Button
              variant={"ghost"}
              size={"sm"}
              disabled={saveMode !== "IDLE"}
              onClick={() => saveClockOptions()}
            >
              {saveMode === "SAVING" ? (
                <Icon
                  icon={"lucide:loader-circle"}
                  fontSize={16}
                  className="animate-spin"
                />
              ) : saveMode === "SAVED" ? (
                <Icon icon={"lucide:bookmark-check"} fontSize={16} />
              ) : saveMode === "ERROR" ? (
                <Icon icon={"lucide:bookmark-x"} fontSize={16} />
              ) : (
                <Icon icon={"lucide:bookmark-plus"} fontSize={16} />
              )}
            </Button>
          </ModernTooltip>
          <ModernTooltip
            tooltipDirection={TooltipDirections.BOTTOM}
            tooltipContent={isCopied ? "Copied" : "Copy"}
            style={{ zIndex: 10 }}
          >
            <Button
              variant={"ghost"}
              size={"sm"}
              disabled={isCopied}
              onClick={copyCompiledOptions}
            >
              {isCopied ? (
                <Icon icon={"lucide:copy-check"} fontSize={16} />
              ) : (
                <Icon icon={"lucide:copy"} fontSize={16} />
              )}
            </Button>
          </ModernTooltip>
        </div>
      </div>
      <div className="w-full mt-2 px-1 flex flex-col gap-1">
        {edittedOptions.map((optionData) => {
          return (
            <OptionRenderer
              optionData={optionData}
              editOption={(keypath: string, value: any) => {
                editOption(optionData.key + "/" + keypath, value);
              }}
              key={optionData.key}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OptionsEditor;
