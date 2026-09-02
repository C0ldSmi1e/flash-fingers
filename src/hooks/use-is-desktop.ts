"use client";

import { useState, useEffect } from "react";

// null until mounted — callers should render nothing until it resolves.
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () =>
      setIsDesktop(
        window.innerWidth >= 1024 && !window.matchMedia("(pointer: coarse)").matches,
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isDesktop;
};

export { useIsDesktop };
