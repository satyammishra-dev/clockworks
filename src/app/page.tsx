import { BookmarkIcon } from "lucide-react";
import OptionsEditor from "./OptionsEditor";
import ClockView from "./ClockView";
import { OptionsEditorContextProvider } from "@/contexts/OptionsEditorContext";

export default function Home() {
  return (
    <OptionsEditorContextProvider>
      <div className="w-full max-w-6xl p-4">
        <div className="w-full flex items-start gap-2">
          <div className="flex-1 flex flex-col gap-3 sticky top-16">
            <ClockView />
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                <BookmarkIcon size={20} />
                <span>Saved Designs</span>
              </h2>
              <div className="w-full mt-2 border border-border rounded-lg text-center text-sm text-muted-foreground p-2">
                Feature under development
              </div>
            </div>
          </div>
          <div className="border border-border rounded-lg min-w-96 p-2">
            <OptionsEditor />
          </div>
        </div>
      </div>
    </OptionsEditorContextProvider>
  );
}
