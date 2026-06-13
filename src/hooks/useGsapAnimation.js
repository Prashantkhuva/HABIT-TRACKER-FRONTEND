"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useGsapFadeUp(ref, deps = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, deps);
}

export function useGsapStagger(containerRef, itemSelector, deps = []) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = el.querySelectorAll(itemSelector);
    if (!items.length) return;
    gsap.fromTo(items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" }
    );
  }, deps);
}

export function useGsapScaleIn(ref, deps = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.4)" }
    );
  }, deps);
}
