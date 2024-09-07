"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

type Props = {};

const GithubStarButton = (props: Props) => {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    const owner = "satyam-mishra-pce";
    const repo = "react-custom-clock";

    const fetchStars = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`
        );
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error("Error fetching repo data:", error);
      }
    };

    fetchStars();
  }, []);
  return (
    <div className="flex items-stretch rounded-sm">
      <div className=" px-2 py-1 flex rounded-l-sm items-center border-[0.8px] gap-1 bg-[#ebf0f4] hover:bg-[#e5eaee] focus:bg-[#e5eaee] dark:bg-[#1a2026] dark:border-[#3d444d] dark:focus:bg-[#1f242c] dark:hover:bg-[#1f242c] ">
        <Icon icon="mdi:github" fontSize={16} className="inline z-10" />
        <a
          href="https://github.com/satyam-mishra-pce/react-custom-clock"
          className="text-xs inline-block"
        >
          Star
        </a>
      </div>
      <a
        href="https://github.com/satyam-mishra-pce/react-custom-clock/stargazers"
        className="px-2 py-1 flex  rounded-r-sm items-center border-[0.8px] hover:text-[#0969da] focus:text-[#0969da] dark:border-[#3d444d] dark:bg-black"
      >
        <span className=" text-xs inline-block ">{stars}</span>
      </a>
    </div>
  );
};

export default GithubStarButton;
