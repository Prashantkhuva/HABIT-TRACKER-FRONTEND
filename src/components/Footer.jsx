import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="px-8 lg:px-20 py-12 border-t bg-[#F4F4EF]"
      style={{ borderColor: "#E8E4DC" }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <Link to={"/"}>
            <h3
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "Epilogue, sans-serif" }}
            >
              habitflow
            </h3>
          </Link>
          <p className="text-xs tracking-widest" style={{ color: "#9A9A8A" }}>
            The premium editorial tracking experience for rhythmic living.
          </p>
        </div>
        <div className="flex gap-12 text-sm" style={{ color: "#6A6A5A" }}>
          <div className="flex flex-col gap-2">
            <p
              className="text-xs tracking-widest font-bold"
              style={{ color: "#1A1A1A" }}
            >
              PRODUCT
            </p>
            <span>Features</span>
            <span>Premium</span>
            <span>Journal</span>
          </div>
          <div className="flex flex-col gap-2">
            <p
              className="text-xs tracking-widest font-bold"
              style={{ color: "#1A1A1A" }}
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
        className="mt-10 pt-6 border-t flex justify-between text-xs"
        style={{ borderColor: "#E8E4DC", color: "#9A9A8A" }}
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
