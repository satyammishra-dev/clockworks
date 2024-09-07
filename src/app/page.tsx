import { Button } from "@/components/ui/button";
import { BookmarkIcon, ClipboardCopyIcon, DropletIcon } from "lucide-react";
import Image from "next/image";
import { Clock } from "react-custom-clock";

export default function Home() {
  return (
    <div className="w-full max-w-6xl p-4">
      <div className="w-full flex items-start gap-2">
        <div className="flex-1 flex flex-col gap-3">
          <div className="w-full flex flex-col items-center px-2 py-8 border border-border/50 rounded-lg relative">
            <div className="absolute top-2 left-2 border border-border rounded-sm p-1 flex flex-col gap-1 bg-background/80 shadow-md">
              <button className="h-4 w-4 border border-border"></button>
              <DropletIcon size={16} color="rgb(100 100 100)" />
            </div>
            <Clock />
          </div>
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              <BookmarkIcon size={20} />
              <span>Saved Designs</span>
            </h2>
          </div>
        </div>
        <div className="border border-border rounded-lg min-w-96 p-2">
          <div className="title flex items-center justify-between">
            <h2 className="font-bold text-lg">Options</h2>
            <Button variant={"outline"} size={"sm"}>
              <ClipboardCopyIcon size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
