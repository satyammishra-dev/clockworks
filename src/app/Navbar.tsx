import { Button } from "@/components/ui/button";
import React from "react";
import AboutDialog from "./AboutDialog";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <AboutDialog asChild>
            <Button variant={"link"} size={"sm"}>
              About
            </Button>
          </AboutDialog>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
