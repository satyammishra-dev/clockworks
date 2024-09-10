import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import ModernTooltip from "@/components/ui/modern-tooltip";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

const AboutDialog = ({
  children,
  asChild,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent>
        {/* <DialogHeader>
          <DialogTitle>About</DialogTitle>
          <DialogDescription>About Clockworks</DialogDescription>
        </DialogHeader> */}
        <div className="w-full flex items-center gap-6">
          <Image
            src={"/media/FramedIcon256.png"}
            height={96}
            width={96}
            alt="Clockworks"
            className="drop-shadow-xl"
          />
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-xl flex items-center">
              <span>About Clockworks</span>
              <code className="text-xs rounded-md bg-muted px-2 py-1 ml-2">
                v0.1.0
              </code>
            </h1>
            <desc className="text-muted-foreground text-sm">
              A tool to design a clock for your React app.
            </desc>
          </div>
        </div>
        <ul className="border border-border/80 divide-y rounded-xl mt-4">
          <li className="flex items-start justify-between p-3 py-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">This app</span>
              <span className="font-bold text-lg font-mono">clockworks</span>
            </div>
            <div className="border border-border rounded-lg flex items-stretch gap-1 overflow-hidden hover:bg-muted/40 ">
              <div className="flex items-center justify-center w-16">
                <Icon icon={"mdi:github"} className="inline text-4xl" />
              </div>
              <div className="flex flex-col py-2 gap-0.5 flex-1">
                <span className="font-bold">Github</span>
                <a
                  href="https://www.github.com/satyam-mishra-pce/clockworks"
                  target="_blank"
                  className="text-sm hover:underline"
                >
                  View Repository
                </a>
              </div>
              <a
                href="https://www.github.com/satyam-mishra-pce/clockworks/stargazers"
                target="_blank"
                className="flex flex-col gap-1 items-center justify-center w-16 hover:bg-muted"
              >
                <Icon icon={"lucide:star"} className="inline text-xl" />
                <span className="text-sm">Star</span>
              </a>
            </div>
          </li>
          <li className="flex flex-col p-3 py-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Powered by</span>
              <a
                href="https://www.npmjs.com/package/react-custom-clock"
                target="_blank"
                className="text-sm hover:underline"
              >
                <Icon
                  icon={"gg:npm"}
                  className="inline mr-1 text-lg text-red-500"
                />
                <span className="text-muted-foreground">View on npm</span>
              </a>
            </div>
            <span className="font-bold text-lg font-mono">
              react-custom-clock
            </span>
            <div className="flex items-start gap-1 mt-1">
              <div className="border border-border/50 hover:border-border text-muted-foreground hover:text-foreground rounded-lg flex items-stretch gap-1 overflow-hidden flex-1 shrink-0">
                <div className="flex items-center justify-center w-8">
                  <Icon icon={"mdi:github"} className="inline text-lg" />
                </div>
                <div className="flex flex-col py-1 gap-1 flex-1">
                  <a
                    href="https://www.github.com/satyam-mishra-pce/react-custom-clock"
                    target="_blank"
                    className="font-mono text-sm -tracking-wider"
                  >
                    /satyam-mishra-pce/react-custom-clock
                  </a>
                </div>
                <a
                  href="https://www.github.com/satyam-mishra-pce/react-custom-clock/stargazers"
                  target="_blank"
                  className="flex gap-1 items-center justify-center w-16 hover:bg-muted"
                >
                  <Icon icon={"lucide:star"} className="inline text-sm" />
                  <span className="text-xs">Star</span>
                </a>
              </div>
            </div>
          </li>
          <li className="flex items-center justify-between p-3">
            <span className="font-bold text-lg font-mono">Developers</span>
            <div className="flex items-center gap-1">
              <ModernTooltip tooltipContent="Satyam Mishra" tooltipWidth={120}>
                <a href="https://github.com/satyam-mishra-pce" target="_blank">
                  <Image
                    src={"https://github.com/satyam-mishra-pce.png"}
                    alt="satyam-mishra-pce"
                    height={32}
                    width={32}
                    className="rounded-full box-content border-1 border-transparent hover:border-blue-500 hover:scale-[120%] hover:shadow-xl transition duration-500"
                  />
                </a>
              </ModernTooltip>
            </div>
          </li>
        </ul>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;
