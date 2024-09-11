"use client";
import React, { createContext, useContext, useState } from "react";
import { OptionData, RGBAColorString } from "./OptionsEditorContext";

export type SavedClock = {
  metadata: {
    id: string;
    rccVersion: "1.0.9";
  };
  presentation: {
    name: string;
    backdrop: RGBAColorString;
    thumbnail: string;
  };
  data: OptionData[];
};

// type SavedClockStorage = {
//   version: 1,
//   savedClocks: SavedClock[]
// }

type SavedClockStorageContextType = {
  savedClocks: SavedClock[];
  saveClock: (data: SavedClock) => void;
  getSavedClock: (id: string) => SavedClock | undefined;
  updateSavedClock: (id: string, data: SavedClock) => void;
  deleteSavedClock: (id: string) => void;
};

const SavedClockStorageContext =
  createContext<SavedClockStorageContextType | null>(null);

export const SavedClockStorageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [savedClocks, setSavedClocks] = useState<SavedClock[]>([]);

  const saveClock = (data: SavedClock) => {
    const foundIndex = savedClocks.findIndex(
      (clock) => clock.metadata.id === data.metadata.id
    );
    if (foundIndex !== -1) {
      throw new Error("Clock could not be added. id already exists.");
    }
    setSavedClocks((prev) => [...prev, data]);
  };

  const getSavedClock = (id: string): SavedClock | undefined => {
    return savedClocks.find((clock) => clock.metadata.id === id);
  };

  const updateSavedClock = (id: string, data: SavedClock) => {
    const foundIndex = savedClocks.findIndex(
      (clock) => clock.metadata.id === data.metadata.id
    );
    if (foundIndex === -1) {
      throw new Error("Clock could not be found.");
    }
    setSavedClocks((prev) =>
      prev.map((clock) => (clock.metadata.id === id ? data : clock))
    );
  };

  const deleteSavedClock = (id: string) => {
    const foundIndex = savedClocks.findIndex(
      (clock) => clock.metadata.id === id
    );
    if (foundIndex === -1) {
      throw new Error("Clock could not be found.");
    }
    setSavedClocks((prev) => prev.filter((clock) => clock.metadata.id !== id));
  };

  return (
    <SavedClockStorageContext.Provider
      value={{
        savedClocks,
        saveClock,
        getSavedClock,
        updateSavedClock,
        deleteSavedClock,
      }}
    >
      {children}
    </SavedClockStorageContext.Provider>
  );
};

const useSavedClockStorageContext = (): SavedClockStorageContextType => {
  const ctx = useContext(SavedClockStorageContext);
  if (ctx === null)
    throw new Error(
      "useSavedClockStorageContaxt must be used within SavedClockStorageContextProvider"
    );
  return ctx;
};

export default useSavedClockStorageContext;
