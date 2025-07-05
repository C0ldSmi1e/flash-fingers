"use client";

import { useEffect } from "react";
import { defaultColors } from "@/types/colors";

const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize colors on app startup
    const initializeColors = () => {
      try {
        const savedColors = localStorage.getItem("flash-fingers-colors");
        const colors = savedColors ? JSON.parse(savedColors) : defaultColors;
        
        // Apply colors to CSS custom properties
        const root = document.documentElement;
        Object.entries(colors).forEach(([key, value]) => {
          root.style.setProperty(
            `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
            value as string
          );
        });
      } catch (error) {
        console.warn("Failed to initialize colors, using defaults:", error);
        // Fallback to default colors
        const root = document.documentElement;
        Object.entries(defaultColors).forEach(([key, value]) => {
          root.style.setProperty(
            `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
            value
          );
        });
      }
    };

    initializeColors();
  }, []);

  return <>{children}</>;
};

export { ColorProvider };