"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSavedClockStorageContext, {
  SavedClock,
} from "@/contexts/SavedClockStorageContext";
import { CheckIcon, MoreVerticalIcon, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useOptionsEditorContext from "@/contexts/OptionsEditorContext";

const ClockItemDropdown = ({
  handleDelete,
  handleEdit,
}: {
  handleEdit: () => void;
  handleDelete: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="px-2">
          <MoreVerticalIcon size={16} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            handleEdit();
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleDelete();
          }}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ClockItemUtils = ({
  data,
  selectClock,
}: {
  data: SavedClock;
  selectClock: () => void;
}) => {
  const { updateSavedClock, deleteSavedClock } = useSavedClockStorageContext();
  const [name, setName] = useState(data.presentation.name);
  const [isNameEditMode, setNameEditMode] = useState(true);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setName(data.presentation.name);
    setNameEditMode(true);
  };

  const handleDelete = () => {
    deleteSavedClock(data.metadata.id);
  };

  const saveName = () => {
    updateSavedClock(data.metadata.id, {
      ...data,
      presentation: { ...data.presentation, name },
    });
    setNameEditMode(false);
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (!isNameEditMode) {
      return;
    }
    input.select();
    if (formRef.current) {
      const form = formRef.current;
      const handleFormBlur = (evt: FocusEvent) => {
        if (form.contains(evt.relatedTarget as Node)) return;
        setNameEditMode(false);
      };
      form.addEventListener("focusout", handleFormBlur);
      return () => {
        form.removeEventListener("focusout", handleFormBlur);
      };
    }
  }, [isNameEditMode, inputRef]);

  return (
    <div className="p-2 w-full flex items-center justify-between gap-1">
      {isNameEditMode ? (
        <form
          className="flex items-center justify-between gap-1.5"
          ref={formRef}
          onSubmit={(evt) => evt.preventDefault()}
        >
          <Input
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            ref={inputRef}
            autoFocus
          />
          <Button className="px-2" onClick={() => saveName()}>
            <CheckIcon size={16} />
          </Button>
        </form>
      ) : (
        <>
          <button
            className="truncate pl-2 flex-1 text-left h-full font-bold"
            onClick={selectClock}
          >
            {data.presentation.name}
          </button>
          <ClockItemDropdown
            handleEdit={() => handleEdit()}
            handleDelete={() => handleDelete()}
          />
        </>
      )}
    </div>
  );
};

const SavedClockItem = ({ data }: { data: SavedClock }) => {
  const { initializeEdittedOptions } = useOptionsEditorContext();
  const handleSelectThisClock = () => {
    initializeEdittedOptions(data.data);
  };
  return (
    <div className="border border-border rounded-xl flex flex-col hover:shadow-md transition duration-300 overflow-hidden">
      <button
        className="w-full flex items-center justify-center p-3"
        style={{
          background: data.presentation.backdrop,
        }}
        onClick={handleSelectThisClock}
      >
        <Image
          src={data.presentation.thumbnail}
          alt={data.presentation.name}
          width={0}
          height={0}
          className="w-full group-hover:blur-sm transition rounded-full"
        />
      </button>
      <ClockItemUtils data={data} selectClock={handleSelectThisClock} />
    </div>
  );
};

export default SavedClockItem;
