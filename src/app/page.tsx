import { BookmarkIcon } from "lucide-react";
import OptionsEditor from "./OptionsEditor";
import ClockView from "./ClockView";
import { OptionsEditorContextProvider } from "@/contexts/OptionsEditorContext";
import { SavedClockStorageContextProvider } from "@/contexts/SavedClockStorageContext";
import SavedClocks from "./SavedClocks";
import { ClockScreenshotContextProvider } from "@/contexts/ClockScreenshotContext";

export default function Home() {
  return (
    <ClockScreenshotContextProvider>
      <OptionsEditorContextProvider>
        <SavedClockStorageContextProvider>
          <div className="w-full max-w-6xl p-4">
            <div className="w-full flex flex-col md:flex-row items-start gap-10 md:gap-2">
              <div className="w-full flex-1 flex flex-col gap-3 md:sticky static top-16">
                <ClockView />
                <div className="flex flex-col w-full gap-2 mt-2">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <BookmarkIcon size={20} />
                    <span>Saved Designs</span>
                  </h2>
                  <SavedClocks />
                </div>
              </div>
              <div className="rounded-lg md:min-w-96 p-0 md:p-2 w-full md:w-auto">
                <OptionsEditor />
              </div>
            </div>
          </div>
        </SavedClockStorageContextProvider>
      </OptionsEditorContextProvider>
    </ClockScreenshotContextProvider>
  );
}
