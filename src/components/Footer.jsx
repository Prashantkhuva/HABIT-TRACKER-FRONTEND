import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="px-8 lg:px-20 py-12 border-t bg-gray-200 dark:bg-[#1D1B20] border-gray-300 dark:border-[#2A2A2A]"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <Link to={"/"}>
            <h3
              className="text-2xl font-bold mb-1 text-[#1A1A1A] dark:text-[#E6E1E5] font-heading"
            >
              habitflow
            </h3>
          </Link>
          <p className="text-xs tracking-widest text-gray-400 dark:text-[#938F99]">
            The premium editorial tracking experience for rhythmic living.
          </p>
        </div>
        <div className="flex gap-12 text-sm text-gray-400 dark:text-[#938F99]">
          <div className="flex flex-col gap-2">
            <p
              className="text-xs tracking-widest font-bold text-[#1A1A1A] dark:text-[#E6E1E5]"
            >
              PRODUCT
            </p>
            <span>Features</span>
            <span>Premium</span>
            <span>Journal</span>
          </div>
          <div className="flex flex-col gap-2">
            <p
              className="text-xs tracking-widest font-bold text-[#1A1A1A] dark:text-[#E6E1E5]"
            >
              COMPANY
            </p>
            <span>About</span>
            <span>Privacy</span>
            <a
              href="https://linktr.ee/prashantkhuva"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              <span>Contact</span>
            </a>
          </div>
        </div>
      </div>
      <div
        className="mt-10 pt-6 border-t flex justify-between text-xs border-gray-300 dark:border-[#2A2A2A] text-gray-400 dark:text-[#938F99]"
      >
        <span>© 2026 HABITFLOW STUDIO. ALL RIGHTS RESERVED.</span>
        <a
          href="https://github.com/Prashantkhuva/HABIT-TRACKER-FRONTEND"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          <span className="text-[14px]">
            Created And Design By{" "}
            <span className="font-bold font-heading">Prashant</span>
          </span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
