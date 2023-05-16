import Link from "next/link";
import React from "react";
import styles from "@/styles/Home.module.css";

export default function Navbar() {
  return (
    <div className="flex fixed justify-self-auto bg-nav-gray">
      <img
        src="https://github.com/pedrolorandi/budget-boss/blob/feature/sidebar/skeleton/planning/Logo.png?raw=true"
        alt="Logo"
        className="object-scale-down h-20 ml-10"
      ></img>
      <nav className="bg-nav-gray text-gray-900 h-20 w-5/6 flex justify-start items-center ps-20">
        <img
          className="rounded-full object-fill h-12 w-12 me-4"
          src="https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mo-mockup-118823744.jpg"
          alt="user-image"
        />
        <div className="">
          <img src="https://i.pinimg.com/550x/50/b2/6c/50b26ce6d2bc8adcf0e9a720c6fdc3f9.jpg" />
          <h1>Hi, Jane!</h1>
        </div>
      </nav>
    </div>
  );
}
