"use client";
import { Button } from "@/components/ui/button";
import useOptionsEditorContext, {
  OptionData,
} from "@/contexts/OptionsEditorContext";
import autoAnimate from "@formkit/auto-animate";
import { ChevronUpIcon, ClipboardCopyIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Switch from "react-switch";
import ColorPicker from "./ColorPicker";
import { Input } from "@/components/ui/input";

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
            if (
              switchRef.current &&
              evt.currentTarget.contains(switchRef.current)
            )
              return;
            if (showProperty && showProperty.currentValue === false) return;
            if (!isExpanded) setExpanded(true);
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
  const { edittedOptions, editOption } = useOptionsEditorContext();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-lg">Options</h2>
        <Button variant={"outline"} size={"sm"}>
          <ClipboardCopyIcon size={16} />
        </Button>
      </div>
      <div className="w-full px-1 flex flex-col gap-1">
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
