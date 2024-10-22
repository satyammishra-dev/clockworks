"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
// import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const GithubStarButton = () => {
  const [stars, setStars] = useState<number>();
  // const { data: session } = useSession();
  // console.log(session);
  const owner = "satyam-mishra-pce";
  const repo = "react-custom-clock";

  // const starRepo = async () => {
  //   if (!session) {
  //     signIn("github");
  //     return;
  //   }

  //   const res = await fetch(`/api/star-repo?owner=${owner}&repo=${repo}`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${session.accessToken}`,
  //     },
  //   });

  //   console.log(res);

  //   if (res.ok) {
  //     alert("Repository starred!");
  //   } else {
  //     alert("Failed to star the repository.");
  //   }
  // };

  useEffect(() => {
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
    <button className="flex items-stretch rounded-sm">
      <a
        href="https://github.com/satyam-mishra-pce/react-custom-clock"
        target="_blank"
        className=" px-2 py-1 flex rounded-l-sm items-center border-[0.8px] gap-1 bg-[#ebf0f4] hover:bg-[#e5eaee] focus:bg-[#e5eaee] dark:bg-[#1a2026] dark:border-[#3d444d] dark:focus:bg-[#1f242c] dark:hover:bg-[#1f242c] "
      >
        <Icon icon="mdi:github" fontSize={16} className="inline z-10" />
        <span className="text-xs inline-block">Star</span>
      </a>
      <a
        href="https://github.com/satyam-mishra-pce/react-custom-clock/stargazers"
        target="_blank"
        className="px-2 py-1 flex  rounded-r-sm items-center border-[0.8px] hover:text-[#0969da] focus:text-[#0969da] dark:border-[#3d444d] dark:bg-black"
      >
        <span className=" text-xs inline-block ">{stars}</span>
      </a>
    </button>
  );
};

export default GithubStarButton;
