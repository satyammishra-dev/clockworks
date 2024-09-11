"use client";
import useSavedClockStorage from "@/contexts/SavedClockStorageContext";
import React, { useEffect, useRef } from "react";
import SavedClockItem from "./SavedClockItem";
import autoAnimate from "@formkit/auto-animate";
import { BookmarkPlusIcon } from "lucide-react";

const SavedClocks = () => {
  const { savedClocks } = useSavedClockStorage();
  const thisRef = useRef<HTMLElement>(null);

  useEffect(() => {
    thisRef.current && autoAnimate(thisRef.current);
  }, [thisRef]);

  return (
    <>
      {savedClocks.length === 0 ? (
        <div className="w-full border border-border rounded-lg text-center text-sm bg-muted text-muted-foreground p-2 flex items-center justify-center gap-1">
          <span>Click</span>
          {""}
          <BookmarkPlusIcon className="inline" size={16} />{" "}
          <span>to save current clock design.</span>
        </div>
      ) : (
        <section
          className="grid grid-cols-3 lg:grid-cols-4 gap-2"
          ref={thisRef}
        >
          {savedClocks.map((clockData) => {
            return (
              <SavedClockItem data={clockData} key={clockData.metadata.id} />
            );
          })}
        </section>
      )}
    </>
  );
};

export default SavedClocks;
