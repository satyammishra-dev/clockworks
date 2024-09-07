"use client";
import { Button } from "@/components/ui/button";
import useOptionsEditorContext, {
  OptionData,
} from "@/contexts/OptionsEditorContext";
import autoAnimate from "@formkit/auto-animate";
import { ChevronUpIcon, ClipboardCopyIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Switch from "react-switch";

const OptionRenderer = ({
  optionData,
  editOption,
}: {
  optionData: OptionData;
  editOption: (keypath: string, value: any) => void;
}) => {
  const isPrimitive =
    optionData.type !== "object" && optionData.currentValue !== undefined;
  console.log("test", optionData);
  const showProperty =
    !isPrimitive &&
    (optionData.currentValue as OptionData[]).find(
      (item) => item.key === "show"
    );
  const [isExpanded, setExpanded] = useState(
    showProperty && (showProperty.currentValue as boolean | undefined)
      ? true
      : false
  );
  const expandedRef = useRef(null);
  useEffect(() => {
    expandedRef.current && autoAnimate(expandedRef.current);
  }, [expandedRef]);

  return (
    <>
      {isPrimitive ? (
        <div className="">
          <div className="flex items-center py-1 px-2">
            <span>{optionData.key}</span>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-lg">
          <div className="flex items-center justify-between p-2">
            <strong>{optionData.key}</strong>
            <div className="flex items-center gap-1">
              {showProperty && (
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
              )}
              {!isPrimitive && (
                <Button
                  size={"xs"}
                  variant={"ghost"}
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  <ChevronUpIcon
                    className={`${
                      isExpanded ? "" : "rotate-180"
                    } transition-all`}
                  />
                </Button>
              )}
            </div>
          </div>
          <div className="px-1 flex flex-col gap-1" ref={expandedRef}>
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

const OptionsEditor = ({}: {}) => {
  const { edittedOptions, editOption } = useOptionsEditorContext();

  return (
    <div className="w-full">
      <div className="title flex items-center justify-between">
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
