"use client";

import { useState, useEffect } from "react";
import { ColorSettings, defaultColors } from "@/types/colors";

const COLOR_STORAGE_KEY = "flash-fingers-colors";

export const useColorPersistence = () => {
  const [colors, setColors] = useState<ColorSettings>(defaultColors);

  // Load colors from localStorage on mount
  useEffect(() => {
    try {
      const savedColors = localStorage.getItem(COLOR_STORAGE_KEY);
      if (savedColors) {
        const parsedColors = JSON.parse(savedColors) as ColorSettings;
        setColors(parsedColors);
      }
    } catch (error) {
      console.warn("Failed to load saved colors:", error);
      // Fallback to defaults if parsing fails
      setColors(defaultColors);
    }
  }, []);

  // Apply colors to CSS custom properties whenever colors change
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(
        `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value
      );
    });
  }, [colors]);

  // Save colors to localStorage
  const saveColors = (newColors: ColorSettings) => {
    try {
      localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(newColors));
      setColors(newColors);
    } catch (error) {
      console.error("Failed to save colors:", error);
    }
  };

  // Update a single color
  const updateColor = (key: keyof ColorSettings, value: string) => {
    const newColors = { ...colors, [key]: value };
    saveColors(newColors);
  };

  // Reset to default colors
  const resetColors = () => {
    saveColors(defaultColors);
  };

  return {
    colors,
    updateColor,
    resetColors,
    saveColors,
  };
};