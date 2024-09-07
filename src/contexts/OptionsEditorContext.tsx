"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ClockOptions } from "react-custom-clock";

type OptionsEditorContextType = {
  edittedOptions: OptionData[];
  editOption: (keyPath: string, value: any) => void;
  initializeEdittedOptions: (options?: ClockOptions) => void;
  compiledOptions: ClockOptions;
};

const OptionsEditorContext = createContext<OptionsEditorContextType | null>(
  null
);

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

export type OptionData = {
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
          : defaultObj.show,
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

const compileOptionsData = (optionsData: OptionData[]) => {
  const options: any = {};
  optionsData.forEach((option) => {
    const key = option.key;
    const value = option.currentValue;
    const keyType = option.type;
    if (keyType === "object") {
      options[key] = compileOptionsData(value);
    } else {
      options[key] = value;
    }
    if (key === "show" && value === false) {
      options[key] = value;
      return;
    }
  });
  return options;
};

const defaultOptionsData = getOptionsData(DEFAULT_OPTIONS, DEFAULT_OPTIONS);
console.log("test def", defaultOptionsData);

export const OptionsEditorContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [edittedOptions, setEdittedOptions] =
    useState<OptionData[]>(defaultOptionsData);
  const [compiledOptions, setCompiledOptions] =
    useState<ClockOptions>(DEFAULT_OPTIONS);

  const editOption = (keypath: string, value: any) => {
    console.log("called", keypath, value);
    const keys = keypath.split("/");
    while (keys[keys.length - 1] === "") {
      keys.pop();
    }

    console.log(keys);

    const updateValue = (
      options: OptionData[],
      keys: string[],
      value: any
    ): OptionData[] => {
      if (keys.length === 0) {
        return options;
      }

      const [firstKey, ...restKeys] = keys;

      return options.map((option) => {
        if (option.key === firstKey) {
          if (restKeys.length > 0 && Array.isArray(option.currentValue)) {
            // Recursively go deeper
            return {
              ...option,
              currentValue: updateValue(option.currentValue, restKeys, value),
            };
          } else if (restKeys.length === 0) {
            // Final key, update the value
            return {
              ...option,
              currentValue: value,
            };
          }
        }
        return option;
      });
    };
    const newOptions = updateValue(edittedOptions, keys, value);
    console.log("test", newOptions);
    setEdittedOptions(newOptions);
  };

  const initializeEdittedOptions = (options?: ClockOptions) => {
    const optionsData = options
      ? getOptionsData(DEFAULT_OPTIONS, options)
      : defaultOptionsData;
    setEdittedOptions(optionsData);
  };

  useEffect(() => {
    setCompiledOptions(compileOptionsData(edittedOptions));
  }, [edittedOptions]);

  return (
    <OptionsEditorContext.Provider
      value={{
        edittedOptions,
        editOption,
        initializeEdittedOptions,
        compiledOptions,
      }}
    >
      {children}
    </OptionsEditorContext.Provider>
  );
};

const useOptionsEditorContext = (): OptionsEditorContextType => {
  const ctx = useContext(OptionsEditorContext);
  if (ctx === null)
    throw new Error(
      "useOptionsEditorContext must be used within OptionsEditorContextProvider"
    );
  return ctx;
};

export default useOptionsEditorContext;
