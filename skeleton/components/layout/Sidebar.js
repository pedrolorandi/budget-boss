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
      <div className="rounded-lg p-5 bg-[#d9d9d9]">
        <img
          src="https://github.com/pedrolorandi/budget-boss/blob/feature/sidebar/skeleton/planning/Logo.png?raw=true"
          alt="Logo"
          className="object-scale-down w-52"
        />
      </div>
      <div className="flex flex-col rounded-lg p-5 bg-[#d9d9d9] mt-2">
        {links.map(({ label, path }) => {
          return (
            <button className="flex flex-row p-2 my-2">
              <Link href={path}>
                <FontAwesomeIcon icon={linkIcons(label)} size="xl" />
                <span className="ms-5 font-bold text-xl">{label}</span>
              </Link>
            </button>
          );
        })}
      </div>
      <div className="flex flex-1 rounded-lg p-5 bg-[#d9d9d9] mt-2"></div>
    </div>
  );
}
