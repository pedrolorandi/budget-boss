import { linkIcons } from "@/helpers/formatters";
import { getLinks } from "@/helpers/selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";

export default function Sidebar() {
  const [activeLink, setActiveLink] = useState(0);
  const [links, setLinks] = useState(getLinks());

  return (
    <div className="h-screen sticky top-0 flex flex-col p-2">
      <div className="rounded-2xl p-5 bg-sidebar border-2 border-borderSidebar">
        <Link href="/">
          <img
            onClick={() => setActiveLink(0)}
            src="./images/logo.png"
            alt="Logo"
            className="w-52"
          />
        </Link>
      </div>
      <div className="flex flex-col rounded-2xl p-5 mt-2 bg-sidebar border-2 border-borderSidebar text-menu">
        {links.map(({ label, path }, i) => {
          return (
            <Link
              href={path}
              key={label}
              className={`flex hover:rounded-xl mt-2 first:mt-0 hover:bg-selected hover:text-white ${
                i === activeLink && "rounded-xl bg-selected text-white"
              }`}
            >
              <button
                className="flex flex-row flex-1 p-2 my-2"
                onClick={() => setActiveLink(i)}
              >
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
      <div className="flex flex-1 rounded-2xl p-5 mt-2 bg-sidebar border-2 border-borderSidebar"></div>
    </div>
  );
}
