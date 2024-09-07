"use client";
import { Button } from "@/components/ui/button";
import { ClipboardCopyIcon } from "lucide-react";
import React, { useState } from "react";
import { ClockOptions } from "react-custom-clock";

const DEFAULT_OPTIONS = {
  size: 400,
  face: {
    background: "white",
    show: true,
    padding: 0,
    ticks: {
      show: true,
      regular: {
        show: true,
        height: 20,
        width: 4,
        background: "rgb(200 200 200)",
        radius: 2,
      },
      secondary: {
        show: true,
        height: 28,
        width: 4,
        background: "black",
        radius: 2,
      },
      primary: {
        show: true,
        height: 36,
        width: 8,
        background: "rgb(0 122 255)",
        radius: 3,
      },
    },
    counts: {
      show: true,
      secondary: {
        show: true,
        size: 20,
        color: "rgb(100 100 100)",
        background: "rgb(0 122 255 / 0)",
        gap: 5,
      },
      primary: {
        show: true,
        size: 25,
        color: "black",
        background: "rgb(0 122 255 / 0.08)",
        gap: 5,
      },
    },
  },
  interface: {
    show: true,
    dynamic: true,
    transition: 300,
    pivot: {
      show: true,
      size: 20,
      background: "rgb(0 0 0)",
    },
    hourHand: {
      show: true,
      front: {
        show: true,
        background: "black",
        radius: 4,
        width: 12,
        height: 80,
        alignment: "CENTER",
      },
      frontBase: {
        show: true,
        background: "grey",
        radius: 2,
        width: 4,
        height: 120,
      },
      back: {
        show: true,
        background: "grey",
        radius: 2,
        width: 4,
        height: 24,
      },
    },
    minuteHand: {
      show: true,
      front: {
        show: true,
        background: "black",
        radius: 4,
        width: 8,
        height: 120,
        alignment: "TICK",
      },
      frontBase: {
        show: true,
        background: "grey",
        radius: 2,
        width: 4,
        height: 150,
      },
      back: {
        show: true,
        background: "grey",
        radius: 2,
        width: 4,
        height: 30,
      },
    },
    secondHand: {
      show: true,
      front: {
        show: true,
        background: "red",
        radius: 4,
        width: 6,
        height: 120,
        alignment: "CENTER",
      },
      frontBase: {
        show: true,
        background: "orange",
        radius: 2,
        width: 4,
        height: 150,
      },
      back: {
        show: true,
        background: "grey",
        radius: 2,
        width: 4,
        height: 30,
      },
    },
  },
} satisfies ClockOptions;

type OptionData = {
  key: string;
  type:
    | "boolean"
    | "number"
    | "color"
    | "undefined"
    | "show"
    | "string"
    | "object";
  currentValue: any;
  defaultValue: any;
};

const getOptionsData = (defaultObj: any, edittedObj: object | undefined) => {
  const optionsData: OptionData[] = [];
  if ("show" in defaultObj) {
    optionsData.push({
      key: "show",
      type: "show",
      currentValue:
        edittedObj !== undefined && "show" in edittedObj
          ? edittedObj.show
          : undefined,
      defaultValue: defaultObj.show,
    });
  }
  for (const key in defaultObj) {
    if (key === "show") continue;
    const typedKey = key as keyof typeof defaultObj as string;
    const keyTypeRaw = typeof defaultObj[typedKey];
    let keyType: OptionData["type"] | null = null;
    if (["number", "string", "object"].includes(keyTypeRaw)) {
      keyType = keyTypeRaw as any;
    }
    if (
      typedKey.toLowerCase().includes("background") ||
      typedKey.toLowerCase().includes("color")
    ) {
      keyType = "color";
    }
    const currentValue =
      edittedObj === undefined
        ? undefined
        : typedKey in (edittedObj as any)
        ? (edittedObj as any)[typedKey]
        : undefined;
    const defaultValue =
      keyTypeRaw === "object"
        ? getOptionsData(defaultObj[typedKey], currentValue)
        : currentValue;

    if (!keyType) continue;
    optionsData.push({
      key,
      type: keyType,
      currentValue: defaultValue,
      defaultValue,
    });
  }
  return optionsData;
};

const OptionRenderer = ({
  optionData,
  editOption,
}: {
  optionData: OptionData;
  editOption: (keypath: string, value: any) => void;
}) => {
  const isPrimitive = optionData.type !== "object";
  const showProperty =
    !isPrimitive &&
    (optionData.defaultValue as OptionData[]).find(
      (item) => item.key === "show"
    );
  const [isExpanded, setExpanded] = useState(
    showProperty && (showProperty.currentValue as boolean | undefined)
      ? true
      : false
  );
  if (!isPrimitive) {
    console.log(
      optionData.key,
      optionData.currentValue,
      optionData.defaultValue
    );
  }

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
          <div className="flex items-center py-1 px-2">
            <strong>{optionData.key}</strong>
          </div>
          {(
            (optionData.currentValue ?? optionData.defaultValue) as OptionData[]
          ).map((subOptionData) => {
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
      )}
    </>
  );
};

const OptionsEditor = ({
  options = DEFAULT_OPTIONS,
}: {
  options?: ClockOptions;
}) => {
  const [edittedOptions, setEdittedOptions] = useState<OptionData[]>(
    getOptionsData(DEFAULT_OPTIONS, options)
  );
  const editOption = (keypath: string, value: any) => {
    const keys = keypath.split("/");
    let options = [...edittedOptions];

    let currentLevel = options;

    // Track parent references to modify deeply nested objects
    const stack: { obj: OptionData; index: number }[] = [];

    // Traverse to the deepest key
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const foundIndex = currentLevel.findIndex((option) => option.key === key);

      if (foundIndex === -1) {
        console.warn(`Key '${key}' not found at depth ${i}`);
        return; // Exit if keypath is invalid
      }

      const foundOption = currentLevel[foundIndex];

      // If it's the last key in the path, update the value
      if (i === keys.length - 1) {
        currentLevel[foundIndex] = { ...foundOption, currentValue: value };
      } else {
        if (!Array.isArray(foundOption.defaultValue)) {
          console.warn(
            `Expected an array at key '${key}', but got ${typeof foundOption.currentValue}`
          );
          return; // Exit if next level isn't an array
        }
        // Store current level to modify later
        stack.push({ obj: foundOption, index: foundIndex });
        // Move to the next level
        currentLevel = [...foundOption.currentValue];
      }
    }

    // Apply changes by updating the object at each parent level
    while (stack.length > 0) {
      const { obj, index } = stack.pop()!;
      obj.currentValue[index] = { ...obj };
    }

    // Only update state if there's an actual change
    setEdittedOptions(options);
  };

  return (
    <div className="w-full">
      <div className="title flex items-center justify-between">
        <h2 className="font-bold text-lg">Options</h2>
        <Button variant={"outline"} size={"sm"}>
          <ClipboardCopyIcon size={16} />
        </Button>
      </div>
      <div className="w-full">
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
