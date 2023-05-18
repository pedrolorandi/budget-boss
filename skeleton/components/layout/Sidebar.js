import { linkIcons } from "@/helpers/formatters";
import { getLinks } from "@/helpers/selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";

export default function Sidebar() {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [links, setLinks] = useState(getLinks());

  return (
    <div className="h-screen sticky top-0 flex flex-col p-2">
      <div className="rounded-lg p-5 bg-[#FFF]">
        <img src="./images/logo.png" alt="Logo" className="w-52" />
      </div>
      <div className="flex flex-col rounded-lg p-5 bg-[#FFF] mt-2">
        {links.map(({ label, path }) => {
          return (
            <Link href={path} key={label} className="flex">
              <button className="flex flex-row flex-1 p-2 my-2">
                <span className="flex w-7 self-center justify-center">
                  <FontAwesomeIcon icon={linkIcons(label)} size="xl" />
                </span>
                <span className="flex flex-1 ms-5 font-bold text-xl">
                  {label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
      <div className="flex flex-1 rounded-lg p-5 bg-[#fff] mt-2"></div>
    </div>
  );
}
